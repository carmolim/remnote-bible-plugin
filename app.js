const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlNhdCBGZWIgMDYgMjAyMSAyMTozMzoyNCBHTVQrMDAwMC5jYXJtb2xpbUBnbWFpbC5jb20iLCJpYXQiOjE2MTI2NDcyMDR9.VDrvFvzd6Ld4QXgSOVzJHqFIpcudgTffGRBwneqhNrc';
const api = 'https://www.abibliadigital.com.br/api/verses';
const $title = document.getElementById('title');
const $form  = document.getElementById('search');

const $book = document.getElementById('book');
$book.focus();

$form.addEventListener( 'submit', async (e)=>{

    e.preventDefault();
     
    let version, bookSel, bookShort, book, chapter, verse;

    version = document.getElementById('version').value;
    bookSel = document.getElementById('book');
    bookShort = document.getElementById('book').value;
    chapter = document.getElementById('chapter').value;
    verse = document.getElementById('verse').value;
    book = bookSel.options[bookSel.selectedIndex].text;

    const url = `${api}/${version}/${bookShort}/${chapter}/${verse}`;
    
    let options;

    if(token){
        
        options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    }

    fetch( url, options )
        .then(response => response.text())
        .then(async (result) =>{
            text = JSON.parse(result).text;
            console.log(text + ' ['+ book + ' ' + chapter + ':' + verse + '](https://www.bibliaonline.com.br/' + version + '/' + bookShort + '/' + chapter + '/' + verse + ')');
            // await addToDoc( text + ' ['+ book + ' ' + chapter + ':' + verse + '](https://www.bibliaonline.com.br/' + version + '/' + bookShort + '/' + chapter + '/' + verse + ')'); 
        })
        .catch(error => console.error('error', error));
});


async function addToDoc(text) {

    var id = await RemNoteAPI.v0.get_context();
    id = id.remId;

    var parentText = await RemNoteAPI.v0.get(id);

    if (parentText.content) {

        await RemNoteAPI.v0.update(id, {
            content: parentText.contentAsMarkdown + `${text}`
        });
    }

    else {
        await RemNoteAPI.v0.update(id, { name: parentText.nameAsMarkdown + `${text}` });
    }

    await RemNoteAPI.v0.close_popup();
}