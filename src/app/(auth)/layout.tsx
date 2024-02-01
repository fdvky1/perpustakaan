export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="hero min-h-screen bg-base-200 bg-pos">
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left" >
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                </div>
                { children }
            </div>
        </div>
    )
}