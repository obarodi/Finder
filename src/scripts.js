const storage = sessionStorage; //stores something?

//different file types
const Types = {
  "TXT" : "text/plain",
  "RTF" : "text/rtf",
  "PDF" : "application/pdf",
  "DOC" : "application/msword",
  "DOCX" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

const enter ="Enter"; //"enter" key

window.onload = () => {
  /* Key Presses */
  document.getElementById("search")
    .addEventListener("keydown", function (event) {
      //clicking _enter_ on keyboard => @highlightText()
      if (event.key === enter) {
        document.getElementById("search-btn").click();
      }
    });

  //toggles color value of highlight
  document.getElementById("chooser")
    .addEventListener("change", () => {
      const chooser = document.getElementById("chooser").value;
      document.getElementById("color").style.backgroundColor = chooser;
    });
}

//displays different HTML pages
function loadPage(div, path) {
  var request = new XMLHttpRequest();

  request.open('GET', path, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var resp = request.responseText;

      document.querySelector(div).innerHTML = resp;
    }
  };

  request.send();
}

//displays user input screen
function selectUserInput() {
    loadPage('#switchable_content', "./user_input/user_input.html");
    storage.setItem("page", "0");
}

//displays upload document screen
function selectUploadDocument() {
  loadPage('#switchable_content', "./document_upload/document_upload.html");
  storage.setItem("page", "1");
}

//displays website screen
function selectWebsite() {
  loadPage('#switchable_content', "./web_page/web_page.html");
}

//keep count of the number of instances of text being searched
function countChars(text, match) {
  let num = document.getElementById("num"); //number of instances of _search_
  num.innerHTML = text.innerHTML.match(match).length.toString(); //# of times search appeared
}

//highlights text being searched
function highlightText(search, match, color, body) {
  body.innerHTML = body.innerHTML.replace(match,
    () => '<span style="background-color: ' + color + '; display: inline;">' + search + '</span>');
}

//removes highlight from text
function removeHighlight(color, body) {
  //init vars
  const span = '<span style="background-color: ' + color + '; display: inline;">';
  const span_closing = '</span>';
  //inits regex'
  const remove = new RegExp(span, 'g');
  const remove_1 = new RegExp(span_closing, 'g');
  //removes color
  body.innerHTML = body.innerHTML.replace(remove, "");
  body.innerHTML = body.innerHTML.replace(remove_1, "");

}

//searches - doc, text - for user's query
function logic() {

  let search = document.getElementById("search").value; //string being searched
  document.getElementById("num").innerHTML = ""; //resets counter
  const chooser = document.getElementById("chooser").value; //current color

  if (storage.getItem("page") === "0") {
    const match = new RegExp(search, 'g'); //matches text

    let output = document.getElementById("output-text"); //text inside container

    //checks if color has changed
    if (chooser !== storage.getItem("color")) {
      removeHighlight(storage.getItem("color"), output);
    } else {
      removeHighlight(chooser, output);
    }
    storage.setItem("color", chooser); //stores color

    //exits function, prevents counter from counting blank spaces
    if (search === "") {
      return;
    }

    highlightText(search, match, chooser, output);
    countChars(output, match);

  } else {
    const p = document.getElementById("placeholder"); //saves text from file
    const match = new RegExp(search, 'g'); //matches text

    //checks if color has changed
    if (chooser !== storage.getItem("color")) {
      removeHighlight(storage.getItem("color"), p);
    } else {
      removeHighlight(chooser, p);
    }
    storage.setItem("color", chooser); //stores color

    highlightText(search, match, chooser, p);
    countChars(p, match);

  }

}

//choose file from computer
function chooseFile() {
  const alert = confirm("Are you wanting to upload a file?"); //displays alert
  const p = document.getElementById("placeholder"); //saves text
  let file; //file chosen by user

  //builds input file element
  const doc = document.createElement("input");
  doc.setAttribute("id", "upload"); //Id
  doc.setAttribute("style", "visibility: hidden"); //style
  doc.setAttribute("type", "file"); //type
  doc.setAttribute("accept",".docx, .pdf, .txt, .rtf, .doc"); //file types

  //if user clicks "Yes" it displays the directory
  if (alert === true) {
    doc.click(); //accesses directory
  }

  doc.addEventListener("change" || "click", () => {

    //get text from file
    file = doc.files.item(0); //saves file

    //toggles display of containers
    document.getElementById("attachment-container").style.display = "none";
    document.getElementById("doc-container").style.display = "flex";

    switch (file.type) {
      case Types.TXT:
        file.text().then((text) => {
          p.innerHTML = text;
        });
        break;
      case Types.RTF:
        file.text().then((text) => {
          const rtf = new RegExp('{\\*?\\\\[^{}]+}|[{}]|\\\\\\n?[A-Za-z]+\\n?(?:-?\\d+)?[]?|\\\\', "g");
          p.innerHTML = text.replace(rtf, "");
        });
        break;
      case Types.DOCX:
        p.innerHTML = "Sorry docx file types are not supported yet.";
        break;
      case Types.DOC:
        p.innerHTML = "Sorry doc file types are not supported yet.";
        break;
      case Types.PDF:
        p.innerHTML = "Sorry PDF file types are not supported yet.";
        break;
    }

  });

}

function editText() {
  const btn = document.getElementById("submit-btn"); //submit button
  const edit = document.getElementById("edit-btn"); //edit button
  let input = document.getElementById("input-area"); //input area
  let container = document.getElementById("output-container"); //output area
  let output = document.getElementById("output-text"); //text inside container

  input.style.display = "flex"; //displays input area
  container.style.display = "none";  //hides output area

  const s = output.innerText;
  input.innerText = s.value; //saves output text

  edit.style.display = "none";
  btn.innerText = "Submit";
}

function submitText() {

  const btn = document.getElementById("submit-btn"); //submit button
  const edit = document.getElementById("edit-btn"); //edit button
  let input = document.getElementById("input-area"); //input area
  let container = document.getElementById("output-container"); //output area
  let output = document.getElementById("output-text"); //text inside container
  btn.blur(); //prevents pressing enter from resetting text
  if (btn.innerText === "Submit") {

    input.style.display = "none"; //hides input area
    const s = input.value; //saves input's value

    edit.style.display = "flex"; //displays edit button
    edit.style.justifyContent = "center";
    container.style.display = "flex"; //displays formatted text
    output.innerText = s; //saves text

    btn.innerText = "Reset"; //toggles button text
  } else if (btn.innerText === "Reset") {

    input.style.display = "flex"; //displays input area
    input.value = ""; //resets input area

    edit.style.display = "none"; //hides edit button
    container.style.display = "none"; //hides text box

    btn.innerText = "Submit"; //changes to submit button
  }

}
