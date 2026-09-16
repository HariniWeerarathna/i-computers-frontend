export default function LandingPage(){

    return(
        <main className="relative flex min-h-[calc(100dvh-180px)] w-full items-center justify-center overflow-hidden bg-primary lg:min-h-[calc(100vh-100px)]">
            <video src="/720p.mp4" autoPlay loop muted className="w-full h-full object-cover absolute top-0 left-0 z-0" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/55 px-5 text-center">
                <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-6xl">Welcome to Isuri Computers</h1>
                <p className="max-w-xl text-base text-white sm:text-lg lg:text-2xl">Your one-stop shop for all your computer needs</p>
                <a href="/products" className="rounded-xl bg-accent px-5 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-900 lg:text-xl">Shop Now</a>
            </div>
        </main>
    )
}
