// Define items
const noteTitle = document.getElementById('noteTitle')
const noteTxt = document.getElementById('noteTxt')
const noteColorPicker = document.getElementById('colorInput')
const addButton = document.getElementById('addButton')


const noteList = document.querySelector('.list-unstyled')

window.addEventListener('load', () => {
    showSavedNotes()
})

// Add button listener ->
addButton.addEventListener('click', addNote)

function addNote(event) {
    event.preventDefault()
    const emptyResult = valueValidation()

    if (emptyResult.length === 0) {
        // Get values
        const title = noteTitle.value.trim()
        const note = noteTxt.value.trim()
        const noteColor = noteColorPicker.value
        const currentDate = new Date()

        // Unique id from date
        const noteId = Date.now()

        // Save note
        const noteObject = {
            id: noteId,
            title: title,
            content: note,
            noteColor: noteColor,
            saveDate: currentDate.toLocaleString()
        }

        saveNoteToLocalStorage(noteObject)

        // Show new note item
        createNoteItem(noteObject)

        // Clear
        noteTitle.value = ''
        noteTxt.value = ''

        toggleNoNotesMessage(false)


    } else {
        // Empty value
        emptyResult.forEach(element => {
            element.classList.add('error-style')
        });

        // Show error message ->
        const errorMessage = document.getElementById('error-message')
        errorMessage.style.display = 'block'

        // Remove error style after 3 seconds
        setTimeout(() => {
            emptyResult.forEach(element => {
                element.classList.remove('error-style')
            });
            errorMessage.style.display = 'none'
        }, 3000)
    }


}

function createNoteItem(noteObject) {
    // Create new list item 
    const newNoteItem = document.createElement('li')
    newNoteItem.classList.add('mb-3')

    // Create new card item
    const noteCard = document.createElement('div')
    noteCard.classList.add('card')
    noteCard.style.backgroundColor = noteObject.noteColor

    // Create card title (header)
    const cardHeader = document.createElement('div')
    cardHeader.classList.add('card-header')
    cardHeader.innerText = noteObject.title

    // Delete button ->
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('btn', 'btn-danger', 'position-absolute', 'top-0', 'end-0', 'm-1')
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
    deleteButton.addEventListener('click', (event) => deleteNote(event, noteObject.id))
    cardHeader.appendChild(deleteButton)

    // Create card body 
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    const noteHolder = document.createElement('blockquote')
    noteHolder.classList.add('blockquote', 'mb-0')
    const noteText = document.createElement('p')
    noteText.textContent = noteObject.content
    noteHolder.appendChild(noteText)
    cardBody.appendChild(noteHolder)

    // Create card footer 
    const noteSaveTime = document.createElement('div')
    noteSaveTime.classList.add('card-footer')
    noteSaveTime.textContent = noteObject.saveDate

    // Fill the card with header, body and footer
    noteCard.appendChild(cardHeader)
    noteCard.appendChild(cardBody)
    noteCard.appendChild(noteSaveTime)

    // Insert the new note in <li>
    newNoteItem.appendChild(noteCard)

    // Add new item to the list (ul)
    noteList.appendChild(newNoteItem)
    newNoteItem.classList.add('note-add-anim')
}

function deleteNote(event, noteId) {
    const button = event.target;
    const li = button.closest('li')

    // Get storage
    const notes = getLocalStorage()
    const updatedNotes = notes.filter(note => note.id !== noteId)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))

    li.classList.add('note-delete-anim')
    li.addEventListener('animationend', () => {
        li.remove()
    })

    if (updatedNotes.length === 0) {
        toggleNoNotesMessage(true)
    }
}

function valueValidation() {
    const emptyList = []
    if (noteTitle.value === '') {
        emptyList.push(noteTitle)
    }
    if (noteTxt.value === '') {
        emptyList.push(noteTxt)
    }
    return emptyList
}

function saveNoteToLocalStorage(note) {
    const notes = getLocalStorage()
    notes.push(note)
    localStorage.setItem('notes', JSON.stringify(notes))
}

function showSavedNotes() {
    const notes = getLocalStorage()
    if (notes.length > 0) {
        notes.forEach(element => {
            createNoteItem(element)
        });
    } else {
        // Notes list is empty
        toggleNoNotesMessage(true)
    }
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || []
}

function toggleNoNotesMessage(show) {
    const noNoteDiv = document.querySelector('.no-note-container')
    if (show) {
        noNoteDiv.style.display = 'block'
    } else {
        noNoteDiv.style.display = 'none'
    }
}
