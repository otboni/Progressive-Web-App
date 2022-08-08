const container = document.querySelector(".container")
const coffees = [
  { name: "Perspiciatis", image: "images/coffee1.jpg" },
  { name: "Voluptatem", image: "images/coffee2.jpg" },
  { name: "Explicabo", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
  { name: " Beatae", image: "images/coffee5.jpg" },
  { name: " Vitae", image: "images/coffee6.jpg" },
  { name: "Inventore", image: "images/coffee7.jpg" },
  { name: "Veritatis", image: "images/coffee8.jpg" },
  { name: "Accusantium", image: "images/coffee9.jpg" },
]

const showCoffees = () => {
    let output = ""
    coffees.forEach(
      ({ name, image }) =>
        (output += `
                <div class="card">
                  <img class="card--avatar" src=${image} />
                  <h1 class="card--title">${name}</h1>
                  <a class="card--link" href="#">Taste</a>
                </div>
                `)
    )
    container.innerHTML = output
  }
  
  //document.addEventListener("DOMContentLoaded", showCoffees)
  document.getElementById("btnCreateLoan").addEventListener("click", run);
  
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(res => console.log("service worker registered"))
        .catch(err => console.log("service worker not registered", err))
    })
  }

  function run() {
  try {
    
  
    // Creating Our XMLHttpRequest object 
    var xhr = new XMLHttpRequest();

    // Making our connection  
    var Principal = document.getElementById("boxPrincipal").value;
    var Months = document.getElementById("boxMonths").value;
    var AnnualRate = document.getElementById("boxAnnualRate").value;


    try {
      if (Number.isNaN(Principal) || Principal=='') {
        alert(Principal + ' is not a Number');
        document.getElementById("boxPrincipal").focus();
        return;
      }
    } catch (error) {
      return;
    }
    try {
      if (Number.isNaN(Interest) || Interest=='') {
        alert(Principal + ' is not a Number');
        document.getElementById("boxInterest").focus();
        return;
      }
    } catch (error) {
      return;
    }
    try {
      if (Number.isNaN(Months) || Months=='') {
        alert(Principal + ' is not a Number');
        document.getElementById("boxMonths").focus();
        return;
      }
    } catch (error) {
      return;
    }
    

    var url = 'https://bearcatloan.azurewebsites.net/api/Loan/' + Principal + '/' + Months + '/' + AnnualRate + '';//'https://jsonplaceholder.typicode.com/todos/1';
    xhr.open("GET", url, true);

    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var json = JSON.parse(this.responseText);
          var NewCard = document.querySelector(".clsCardTemplate").cloneNode(true);
          //Set up a new loan from the template and remove the template class
          NewCard.classList.remove("clsCardTemplate");
          NewCard.querySelector(".divMonthlyPayment").innerHTML = json.MonthlyPayment;
          NewCard.querySelector(".divPrincipal").innerHTML = json.Principal;
          NewCard.querySelector(".btnShowSchedule").addEventListener("click", 
          function () {
//alert('hi');
NewCard.querySelector(".Schedule").classList.remove("Hidden");
          }
          );
          //Set up the full schedule
          var Schedule = json.Schedule;

          //Add the Titles line
          var NewTitles = document.querySelector(".clsLineTemplate").cloneNode(true);
          NewTitles.classList.remove("clsLineTemplate");
          NewCard.querySelector(".Schedule").appendChild(NewTitles);
        //Add All of the lines
          for (let index = 0; index < Schedule.length; index++) {
            const Line = Schedule[index];
            var NewLine = document.querySelector(".clsLineTemplate").cloneNode(true);
            NewLine.classList.remove("clsLineTemplate");
            NewLine.querySelector(".Balance").innerHTML = formatter.format(Line.Balance);
            NewLine.querySelector(".Interest").innerHTML = formatter.format(Line.Interest);
            NewLine.querySelector(".Month").innerHTML = getFormattedDate(DateConverter(Line.Months));
            NewLine.querySelector(".Total").innerHTML = formatter.format(json.MonthlyPayment * index);
            NewCard.querySelector(".Schedule").appendChild(NewLine);
          }
          
          //Add the new loan to the container
          container.appendChild(NewCard);w
        } 
    }
    // Sending our request 
    xhr.send();
  } catch (error) {
    console.warn('Error with API');
  }}
//run();

//https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});
function DateConverter(GivenDate){
  return new Date(GivenDate.slice(0, 10));
}

function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + '/' + day + '/' + year;
}