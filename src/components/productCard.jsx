export default function ProductCard(props) {//P-capital only

    console.log(props)
    
    return(
        <div className="bg-blue-700 w-60 h-[330.5px]"> {/*manual use squred brackets-[]*/}
            <img src={props.image} />
            <h1>{props.name}</h1>
            <p>Price:{props.price}</p>
        </div>
    )
}