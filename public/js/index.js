const chatForm = document.querySelector("#chatForm")
const email = document.querySelector("#emailInput")
const names = document.querySelector("#nameInput")
const surname = document.querySelector("#surnameInput")
const age = document.querySelector("#ageInput")
const alias = document.querySelector("#aliasInput")
const avatar = document.querySelector("#avatarInput")
const message = document.querySelector("#textInput")
const msgsTable = document.querySelector("#msContainer")
const socket = io()

const author = new normalizr.schema.Entity("author", {}, {idAttribute: "email"});
const msg = new normalizr.schema.Entity("messages", {author: author}, {idAttribute: "_id"});
const finalSchema = [msg]
const denormalizeData = (data) => {
    const denormalizedData = normalizr.denormalize(data.result, finalSchema, data.entities)
    return denormalizedData
}

chatForm.addEventListener("submit", (e)=> {
    
    e.preventDefault()
    if(values.every(valueNotNull)){
        console.log(`Rellena todos los campos`);
    }else{
        let data = {
            author: {
                email: email.value,
                name: names.value,
                surname: surname.value,
                age: age.value,
                alias: alias.value,
                avatar: avatar.value
            },
            text: message.value
        }
        socket.emit("postMsgToDB", data)
    }
    email.value = ""
    names.value = ""
    surname.value = ""
    age.value = ""
    alias.value = ""
    avatar.value = ""
    message.value = ""
})

socket.on("fetchMsgsFromDB", (normalizedData) => {

    const denormalized = denormalizeData(normalizedData)
    denormalized.forEach((msg) => {

        const div = document.createElement("div") 
        div.innerHTML = `
          
        <div class="d-flex justify-content-between">
            <p class="small mb-1"> ${msg.author.email} </p>  
            <p class="small mb-1 text-muted"> ${msg.createdAt} </p> 
        </div>	 
        <div class="d-flex flex-row justify-content-start"> 
            <div>
                <p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;"> ${msg.text} </p>
            </div>
        </div		
        
        `
        msgsTable.appendChild(div)
    });
})

socket.on("newMsgInDB", (newMsg) => {
    
    const div = document.createElement("div") 
	div.innerHTML = `
	  
	<div class="d-flex justify-content-between">
		<p class="small mb-1"> ${newMsg.author.email} </p>  
		<p class="small mb-1 text-muted"> ${newMsg.createdAt} </p> 
	</div>	 
	<div class="d-flex flex-row justify-content-start"> 
		<div>
			<p class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;"> ${newMsg.text} </p>
		</div>
	</div		
	
	`
	msgsTable.appendChild(div)
})

const values = [
    email.value, names.value, surname.value, age.value, alias.value, avatar.value, message.value
]

const valueNotNull = (value) => {value !== undefined || value !== null || value !== " " }