const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlNhdCBGZWIgMDYgMjAyMSAyMTozMzoyNCBHTVQrMDAwMC5jYXJtb2xpbUBnbWFpbC5jb20iLCJpYXQiOjE2MTI2NDcyMDR9.VDrvFvzd6Ld4QXgSOVzJHqFIpcudgTffGRBwneqhNrc';
const api = 'https://www.abibliadigital.com.br/api/verses';
const $appVersion = document.getElementById('app-version');
const $form  = document.getElementById('search');

const $book = document.getElementById('book');
$book.focus();

$appVersion.innerHTML = '0.0.2';

const preferredVersion = getCookie('bibleVersion');

if(preferredVersion){
    document.getElementById('version').value = preferredVersion;
}

setCookie('last', 'agora', 30);

$form.addEventListener( 'submit', async (e)=>{

    e.preventDefault();
     
    let version, bookSel, bookShort, book, chapter, verse;

    version = document.getElementById('version').value;
    bookSel = document.getElementById('book');
    bookShort = document.getElementById('book').value;
    chapter = document.getElementById('chapter').value;
    verse = document.getElementById('verse').value;
    book = bookSel.options[bookSel.selectedIndex].text;

    setCookie('bibleVersion', version, 30);

    const url = `${api}/${version}/${bookShort}/${chapter}/${verse}`;
    
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    fetch( url, options )
        .then(response => response.text())
        .then(async (result) =>{

            data = JSON.parse(result);
            text = data.text;

            if( version == 'acf' || version == 'nvi'){

                book = data.book.name;
                await addToDoc( text + ' ['+ book + ' ' + chapter + ':' + verse + ' - ' + version.toUpperCase() + '](https://www.bibliaonline.com.br/' + version + '/' + bookShort + '/' + chapter + '/' + verse + ')'); 

            }

            else{

                await addToDoc( text + ' ['+ book + ' ' + chapter + ':' + verse + ' - ' + version.toUpperCase() + '](https://www.bibliaonline.com.br/' + version + '/' + bookShort + '/' + chapter + '/' + verse + ')'); 

            }

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

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; SameSite=None; Secure";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}