package com.nda.utils;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.util.Collections;
import java.util.Date;
import java.util.List;

public class JwtUtils {
    // SECRET ở dạng HEX của 32 bytes (64 ký tự hex)
    private static final String SECRET_HEX = "33ced279a05fbefe8d02e5b8e3f21d250526c56c977d411e3d9553cdb8da71c8";
    private static final byte[] SECRET_BYTES = hexToBytes(SECRET_HEX);

    private static final long EXPIRATION_MS = 86_400_000L; // 1 ngày

    /** Sinh token chỉ với subject (username) */
    public static String generateToken(String username) throws Exception {
        return generateToken(username, null);
    }

    /** Sinh token có thêm claim roles (vd: ["ROLE_ADMIN","ROLE_EMPLOYER"]) */
    public static String generateToken(String username, List<String> roles) throws Exception {
        JWSSigner signer = new MACSigner(SECRET_BYTES);

        JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
                .subject(username)
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_MS));

        if (roles != null && !roles.isEmpty()) {
            builder.claim("roles", roles);
        }

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), builder.build());
        signedJWT.sign(signer);
        return signedJWT.serialize();
    }

    /** Xác thực + còn hạn -> trả username, ngược lại trả null */
    public static String validateTokenAndGetUsername(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET_BYTES);

        if (!signedJWT.verify(verifier)) return null;

        Date exp = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (exp == null || exp.before(new Date())) return null;

        return signedJWT.getJWTClaimsSet().getSubject();
    }

    /** Lấy danh sách vai trò từ token (đã verify chữ ký và hạn) */
    public static List<String> getRoles(String token) throws Exception {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SECRET_BYTES);

        if (!signedJWT.verify(verifier)) return Collections.emptyList();

        Date exp = signedJWT.getJWTClaimsSet().getExpirationTime();
        if (exp == null || exp.before(new Date())) return Collections.emptyList();

        List<String> roles = signedJWT.getJWTClaimsSet().getStringListClaim("roles");
        return roles != null ? roles : Collections.emptyList();
    }

    /** Helper: chuyển chuỗi hex -> byte[] */
    private static byte[] hexToBytes(String hex) {
        if (hex == null) throw new IllegalArgumentException("hex is null");
        int len = hex.length();
        if (len % 2 != 0) throw new IllegalArgumentException("hex length must be even");
        byte[] out = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            out[i / 2] = (byte) ((toNibble(hex.charAt(i)) << 4) | toNibble(hex.charAt(i + 1)));
        }
        return out;
    }
    private static int toNibble(char c) {
        if (c >= '0' && c <= '9') return c - '0';
        if (c >= 'a' && c <= 'f') return 10 + (c - 'a');
        if (c >= 'A' && c <= 'F') return 10 + (c - 'A');
        throw new IllegalArgumentException("Invalid hex char: " + c);
    }
}
