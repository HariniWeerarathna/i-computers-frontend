import { createClient } from "@supabase/supabase-js"

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bW5sZmVhcHlxcnl1cHJ6am1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNzA5MDQsImV4cCI6MjA5Nzk0NjkwNH0.xLHuVx3XzebliwDd0_skRDv9TXL9VP0-04axz-90sm4"
const url = "https://eumnlfeapyqryuprzjmk.supabase.co"

const supabase = createClient(url,key)


export default function uploadMedia(file) {
    
	return new Promise((resolve, reject) => {
		if (file == null) {
			reject("No file selected");
		} else {

            const timestamp = new Date().getTime()

            const fileName = timestamp + "_" + file.name;

			supabase.storage
				.from("images")
				.upload(fileName, file)
				.then(() => {

					const publicUrl = supabase.storage
						.from("images")
						.getPublicUrl(fileName).data.publicUrl;

                    resolve(publicUrl);

				})
				.catch((err) => {
					reject(err);
				});
		}
	});
}


//* supabase: upload file is show in console

/* supabase.storage.from("images").upload(file.name,file).then(
            ()=>{
                const publicurl = supabase.storage.from("images").getPublicUrl(file.name).data.publicUrl
                console.log(publicurl)
            }
        ).catch(
            ()=>{
                toast.error("file upload fail")     
            }
        )*/