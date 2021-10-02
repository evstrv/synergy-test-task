import axios from "axios"

export async function addUser() {
    try {
        const user = await axios.get("https://randomuser.me/api/");
        return user.data.results;
    } catch(err) {
        console.log("error: ", err);
    }
}