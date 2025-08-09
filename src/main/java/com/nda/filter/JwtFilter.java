package com.nda.filter;

import com.nda.utils.JwtUtils;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

public class JwtFilter implements Filter {
    private static final String SECURE_PREFIX = "/api/secure";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req  = (HttpServletRequest) request;
        HttpServletResponse resp = (HttpServletResponse) response;

        // Không áp filter nếu không phải /api/secure/**
        String path = req.getServletPath(); // vd: /api/secure/cart/total
        if (path == null || !path.startsWith(SECURE_PREFIX)) {
            chain.doFilter(request, response);
            return;
        }

        // Cho phép preflight CORS đi qua
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            write401(resp, "Missing or invalid Authorization header.");
            return;
        }

        String token = header.substring(7);
        try {
            // Tự util của bạn (giữ nguyên tên phương thức hiện có)
            String username = JwtUtils.validateTokenAndGetUsername(token);
            if (username == null || username.isBlank()) {
                write401(resp, "Token không hợp lệ hoặc hết hạn.");
                return;
            }

            // (Tuỳ chọn) lấy roles từ token nếu bạn có claim "roles"
            List<String> roles = JwtUtils.getRoles(token); // có thể trả null nếu bạn chưa hỗ trợ
            var authorities = roles == null ? List.<SimpleGrantedAuthority>of()
                    : roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());

            // Truyền cho controller dùng request.getAttribute("username")
            req.setAttribute("username", username);

            // Đưa vào SecurityContext để @PreAuthorize/Authentication hoạt động
            var auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            chain.doFilter(request, response);
        } catch (Exception ex) {
            // TODO: log lỗi nếu cần
            write401(resp, "Token không hợp lệ hoặc hết hạn.");
        } finally {
            // Không xoá SecurityContext ở đây, để Spring tự clear sau request
        }
    }

    private void write401(HttpServletResponse resp, String message) throws IOException {
        resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        resp.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resp.setContentType("application/json");
        resp.getWriter().write("{\"error\":\"unauthorized\",\"message\":\"" + message + "\"}");
    }
}
