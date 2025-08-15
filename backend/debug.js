import Colors from "colors"

export function printArr(arr) {
	var str = "[ "

	arr.forEach((ele) =>{
		str += ele.toString() + " "
	})
	str += "]"
	return (str)
}
