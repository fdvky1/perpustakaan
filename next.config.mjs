/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [{
            protocol: "https",
            hostname: "placehold.co",
            port: "",
            pathname: "/**"
        },{
            protocol: "https",
            hostname: "utfs.io",
            port: "",
            pathname: "/f/**"
        }]
    }
};

export default nextConfig;
