import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 자체 호스팅한 Pretendard. 파일이 바뀌지 않으므로 영구 캐시한다.
        // 해외 로밍에서 쓰는 앱이라 두 번째 실행부터는 한 바이트도 안 받게 한다.
        source: "/fonts/pretendard/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
