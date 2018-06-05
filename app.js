// GOING BETWEEN PAGES

// LOGIN PAGE

loginbutton.addEventListener('click', e => {
  innerlogin.classList.add('hide');
  innerlogin2.classList.remove('hide');
});

registerbutton.addEventListener('click', e => {
  innerlogin.classList.remove('hide');
  innerlogin2.classList.add('hide');
});

//END LOGIN PAGE



// CHECKIN PAGE
checkinbutton.addEventListener('click', e => {
  checkinpage.classList.remove('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');   

  checkinbutton.classList.add('active'); 
  mytripbutton.classList.remove('active'); 
  weatherbutton.classList.remove('active'); 
  profilebutton.classList.remove('active'); 
  settingsbutton.classList.remove('active'); 
});
//END CHECKIN PAGE

// NEW TRIP PAGE
mytripbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.remove('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');  

  checkinbutton.classList.remove('active'); 
  mytripbutton.classList.add('active'); 
  weatherbutton.classList.remove('active'); 
  profilebutton.classList.remove('active'); 
  settingsbutton.classList.remove('active');   
});
//END TRIP PAGE

// WEATHER PAGE
weatherbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.remove('hide');
  profilepage.classList.add('hide');
  settingspage.classList.add('hide');    

  checkinbutton.classList.remove('active'); 
  mytripbutton.classList.remove('active'); 
  weatherbutton.classList.add('active'); 
  profilebutton.classList.remove('active'); 
  settingsbutton.classList.remove('active'); 
});
//END WEATHER PAGE

// PROFILE PAGE
profilebutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.remove('hide');
  settingspage.classList.add('hide');  

  checkinbutton.classList.remove('active'); 
  mytripbutton.classList.remove('active'); 
  weatherbutton.classList.remove('active'); 
  profilebutton.classList.add('active'); 
  settingsbutton.classList.remove('active');   
});
//END PROFILE PAGE

// SETTINGS PAGE
settingsbutton.addEventListener('click', e => {
  checkinpage.classList.add('hide');
  newtrippage.classList.add('hide');
  weatherpage.classList.add('hide');
  profilepage.classList.add('hide');
  settingspage.classList.remove('hide');  

  checkinbutton.classList.remove('active'); 
  mytripbutton.classList.remove('active'); 
  weatherbutton.classList.remove('active'); 
  profilebutton.classList.remove('active'); 
  settingsbutton.classList.add('active');   
});
//END SETTINGS PAGE

//END GOING BETWEEN PAGES BUTTONS










//ACCORDION FOR PROFILE PAGE 

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

var acc2 = document.getElementsByClassName("accordionnewtrip");
var a;

for (a = 0; a < acc2.length; a++) {
    acc2[a].addEventListener("click", function() {
        this.classList.toggle("active");
        var panelnewtrip = this.nextElementSibling;
        if (panelnewtrip.style.display === "block") {
            panelnewtrip.style.display = "none";
        } else {
            panelnewtrip.style.display = "block";
        }
    });
}
//END OF ACCORDION FOR PROFILE PAGE

var acc3 = document.getElementsByClassName("accordionlogin");
var v;

for (v = 0; v < acc3.length; v++) {
    acc3[v].addEventListener("click", function() {
        this.classList.toggle("active");
        var panelnewtrip = this.nextElementSibling;
        if (panelnewtrip.style.display === "block") {
            panelnewtrip.style.display = "none";
        } else {
            panelnewtrip.style.display = "block";
        }
    });
}

// var acc4 = document.getElementsByClassName("accordionguest");
// var k;

// for (k = 0; k < acc4.length; k++) {
//     acc4[k].addEventListener("click", function() {
//         this.classList.toggle("active");
//         var panelnewtrip = this.nextElementSibling;
//         if (panelnewtrip.style.display === "block") {
//             panelnewtrip.style.display = "none";
//         } else {
//             panelnewtrip.style.display = "block";
//         }
//     });
// }


