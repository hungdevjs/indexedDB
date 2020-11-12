let db = null

const createDB = () => {
    const dbInput = document.getElementById("dbInput").value
    const version = document.getElementById("versionInput").value

    // open method will success if new version is >= db version in indexedDB, otherwise error will be occured
    // if new version > db's version in indexedDB => update version in indexedDB
    const request = indexedDB.open(dbInput, version)

    request.onupgradeneeded = e => {
        db = e.target.result

        const personalNotes = db.createObjectStore("personal_notes", { keyPath: "title" }) // make title as object key
        const todoNotes = db.createObjectStore("todo_notes", { keyPath: "title" }) // make title as object key

        alert("update is called")
    }

    request.onsuccess = e => {
        db = e.target.result
        alert(`Connect succes to database ${db.name} version ${db.version}`)
    }

    request.onerror = e => {
        alert(`error! ${e.target.error}`)
    }
}

const addNote = () => {
    try {
        const note = {
            title: "hungdevjs" + Math.random(),
            text: "Web Developer"
        }

        const tx = db.transaction("personal_notes", "readwrite")
        tx.onerror = e => alert(`Error! ${e.target.error}`)
        const pNotes = tx.objectStore("personal_notes")
        pNotes.add(note)
    } catch (err) {
        console.log(err.message)
    }
}

const viewNotes = () => {
    const pNoteList = document.getElementById("personalNoteList")
    let html = ``
    const tx = db.transaction("personal_notes", "readonly")
    const pNotes = tx.objectStore("personal_notes")

    const request = pNotes.openCursor()
    request.onsuccess = e => {
        const cursor = e.target.result

        if (cursor) {
            // do something with cursor
            // cursor.key === cursor.value.title (line 14, 15)
            html += `<li>
                title: ${cursor.key} - text: ${cursor.value.text}
            </li>`

            console.log(html)

            // next document
            cursor.continue()
        }

        console.log(html)
        pNoteList.innerHTML = html
    }
}

const createBtn = document.getElementById("createBtn")
const addNoteBtn = document.getElementById("addNoteBtn")
const viewNoteBtn = document.getElementById("viewNoteBtn")

createBtn.addEventListener("click", createDB)
addNoteBtn.addEventListener("click", addNote)
viewNoteBtn.addEventListener("click", viewNotes)