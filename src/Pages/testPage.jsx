import LoadingAnimation from "../components/loadingAnimation"

export default function TestPage(){

    return(
        <div className="w-screen h-screen ">
            <div className="w-[200px] h-[200px] bg-red-700 md:bg-blue-600 lg:bg-green-600"> {/*md - medium screen, lg - large screen, sm - small screen, xl - extra large screen*/}
            </div>   
        </div>
    )   
}








//* React File Upload Component:

/*import { useState } from "react"
import toast from "react-hot-toast"
import uploadMedia from "../lib/uploadMedia"

export default function TestPage(){

    const[file,setFile] = useState(null)


//? 1.File Upload (Promise)

    function uploadfile(){    
        uploadMedia(file).then(
            (res)=>
                console.log(res)
        ).catch(
             (err)=>{
                console.log(err)
                toast.error("Upload failed")
            }
        )
    }


//? 2. File Upload (Async/Await)

// async function uploadFileAsync(){
//     try{
//          const fileUrl = await uploadMedia(file)
//             console.log(fileUrl)
//         }
//         catch(err){
//             console.log(err)
//             toast.error("Upload failed")
//         }
//     }


    return(
        <div className="w-full h-full flex items-center justify-center">
            <input type="file" 
            onChange={ //Input type - this get data in a array
                  (e)=>{
                    setFile(e.target.files[0])
                 }  
             }/>
             <button onClick={uploadfile} className="bg-green-600 text-white p-2 rounded-lg">Submit</button>
        </div>
    )
}*/






//* React Hooks: useState, Event Handling, and Toast Notifications

/*import { useState } from "react"
import toast from "react-hot-toast"

export default function TestPage() {

    const[status, setStatus] = useState("Off") //react hook - useState()   
    const [level, setLevel] = useState("1")
    
    return(
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">{status}</h1>
            

            <div className="w-75 h-[50px] flex justify-center items-center">

                <buttton onClick={ //javascript in html ---> we use {}
                    () => {
                        // status = "On"
                        setStatus("On")
                        toast.success("The system is now on")
                    }
                } className="p-2 text-white m-2 bg-green-600" >Turn On</buttton>
                

                <buttton onClick={
                    ()=>{
                        setStatus("Off")
                        toast.error("The system is now off")
                    }
                } className="p-2 text-white m-2 bg-red-600" >Turn Off</buttton>
                

                <buttton  onClick={
                    ()=>{
                        setStatus("Idle")
                        toast.error("The system is now idle")
                    }
                }className="p-2 text-white m-2 bg-yellow-600" >Idle</buttton>

            </div>

            <h1 className="text-3xl font-bold">{level}</h1>
            <div className="w-75 h-[50px] flex justify-center items-center">

                <button onClick={
                    ()=>{
                        setLevel("1")
                    }
                } className="p-2 text-white m-2 bg-green-600">1</button>

                <button onClick={
                    ()=>{
                        setLevel("2")
                    }
                } className="p-2 text-white m-2 bg-red-600">2</button>
                <button onClick={
                    ()=>{
                        setLevel("3")
                        setLoading(true)
                    }
                } className="p-2 text-white m-2 bg-yellow-600">3</button>

            </div>
        </div>
    )
}*/





//* Margin and Padding in CSS

/*export default function TestPage() {
    return(
        <div className="w-full h-full">
             <div className="w-[280px] h-[280px] m-4 bg-yellow-300 pt-[10px] ">//pt,pb,pl,pr - padding top, bottom, left, right
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eum maxime possimus est, doloremque earum incidunt, pariatur illum quos laudantium mollitia quasi non animi omnis saepe fugit eius deserunt sed neque rerum facilis vero itaque eligendi! Repudiandae accusamus dolorem ratione.
            </div>
            <div className="w-[280px] h-[280px] mb-[30px] bg-yellow-300 pt-[10px] ">//mt,mb,ml,mr - margin top, bottom, left, right
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eum maxime possimus est, doloremque earum incidunt, pariatur illum quos laudantium mollitia quasi non animi omnis saepe fugit eius deserunt sed neque rerum facilis vero itaque eligendi! Repudiandae accusamus dolorem ratione.
            </div>
            <div className="w-[280px] h-[280px] bg-yellow-300 pt-[10px] ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eum maxime possimus est, doloremque earum incidunt, pariatur illum quos laudantium mollitia quasi non animi omnis saepe fugit eius deserunt sed neque rerum facilis vero itaque eligendi! Repudiandae accusamus dolorem ratione.
            </div>
            <div className="w-[280px] h-[280px] bg-yellow-300 pt-[10px] ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eum maxime possimus est, doloremque earum incidunt.
            </div>
            <div className="w-[280px] h-[280px] m-5 bg-yellow-300 pt-[10px] ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel eum maxime possimus est, doloremque earum incidunt.
            </div>
        </div>
    )
}*/





//* Alignment and positions in CSS:

/*export default function TestPage() {
    return(
        <div className="w-full h-full">
            <div className="flex flex-col relative items-center gap-2 justify-center w-[600px] h-[600px]  bg-yellow-400">  // normally block but in flex ---> default is flex-row ---> all in horizontal row(__)
                <div className="w-[100px] h-[100px] bg-red-600">
                </div>
                <div className="fixed right-10 w-[100px] h-[100px] bg-green-600"> // absolute --> lagama relativeta sapekshawa we.
                </div>
                <div className="absolute right-20 w-[100px] h-[100px] bg-blue-600">
                </div>
                <div className="w-[100px] h-[100px] bg-white">
                </div>
                <div className="w-[100px] h-[100px] bg-black">
                </div>
            </div>
        </div>
    )
}*/