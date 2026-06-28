export default function LoadingAnimation() {
    return(
        <div className="w-screen h-screen bg-black/50 flex justify-center items-center fixed left-0 top-0">   

            <div className="w-[100px] h-[100px] border-8 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}


// w-screen h-screen ---> Sets the width & height to 100% of the viewport width & height.

//w-screen h-screen    →   Fills the browser viewport.
//w-full h-full        →   Fills 100% of the parent element's width and height (the parent must have a defined size).




//animate-spin      ---->  Tailwind CSS utility class that continuously rotates an element.

/*Other Tailwind animation classes:

    1. animate-spin → 🔄 Continuous rotation
    2. animate-ping → 📡 Expanding pulse
    3. animate-pulse → 💓 Fades in and out
    4. animate-bounce → ⬆️⬇️ Bouncing effect
*/