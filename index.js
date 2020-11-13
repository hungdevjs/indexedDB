let db = null

const createDB = () => {
    const dbInput = document.getElementById("dbInput").value
    const version = document.getElementById("versionInput").value

    // open method will success if new version is >= db version in indexedDB, otherwise error will be occured
    // if new version > db's version in indexedDB => update version in indexedDB
    const request = indexedDB.open(dbInput, version)

    request.onupgradeneeded = e => {
        db = e.target.result

        const personalNotes = db.createObjectStore("personal_notes", { autoIncrement: true }) // auto increase key for document
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
            title: "hungdevjs",
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
    const tx = db.transaction("personal_notes", "readwrite")
    const pNotes = tx.objectStore("personal_notes")

    const request = pNotes.openCursor()
    request.onsuccess = e => {
        const cursor = e.target.result

        if (cursor) {
            // do something with cursor
            // cursor.key === cursor.value.title in todoNotes (line 15)
            html += `<li class="pNote" id="note-${cursor.key}">
                Id: ${cursor.key} - text: ${cursor.value.text}
            </li>`

            // next document
            cursor.continue()
        }

        pNoteList.innerHTML = html
        const pNoteElements = [...document.getElementsByClassName("pNote")]
        for (pNoteEle of pNoteElements) {
            pNoteEle.addEventListener("click", e => {
                console.log(e.target)
                const id = parseInt(e.target.id.split("-")[1])
                deleteNote(id)
            })
        }
    }
}

const deleteNote = id => {
    const tx = db.transaction("personal_notes", "readwrite")
    const pNotes = tx.objectStore("personal_notes")
    const request = pNotes.delete(id)
    request.onsuccess = e => {
        alert(`Deleted personal notes id: ${id}`)
    }

    request.onerror = e => {
        alert(`Error: ${e.target.error}`)
    }
}

const updateNote = () => {
    const id = parseInt(document.getElementById("putId").value)
    const text = document.getElementById("putText").value

    const tx = db.transaction(["personal_notes", "todo_notes"], "readwrite")
    const pNotes = tx.objectStore("personal_notes")
    const request = pNotes.put({ text }, id)
    request.onsuccess = e => alert(`Update success personal note id: ${id}`)
    request.onerror = e => alert(`Error: ${e.target.error}`)
}

const createBtn = document.getElementById("createBtn")
const addNoteBtn = document.getElementById("addNoteBtn")
const viewNoteBtn = document.getElementById("viewNoteBtn")
const updateBtn = document.getElementById("putBtn")

createBtn.addEventListener("click", createDB)
addNoteBtn.addEventListener("click", addNote)
viewNoteBtn.addEventListener("click", viewNotes)
updateBtn.addEventListener("click", updateNote)
