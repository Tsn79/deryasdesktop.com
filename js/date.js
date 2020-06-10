(function(){
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };

    Date.prototype.getDayName = function() {
        return days [ this.getDay() ];
    };
})();

const shortenDay = day => {
    let shortened = '';

    switch(day) {

        case 'Sunday':
        shortened = 'Sun';
        break;

        case 'Monday':
        shortened = 'Mon';
        break;

        case 'Tuesday':
        shortened = 'Tue';
        break;
        
        case 'Wednesday':
        shortened = 'Wed';
        break;

        case 'Thursday':
        shortened = 'Thu';
        break;

        case 'Friday':
        shortened = 'Fri';
        break;

        case 'Saturday':
        shortened = 'Sat';
        break;
    }
    return shortened;
}


const formatDateAndTime = (day, hour, min) => {
    let str = '';

    function checkTime(time) {
        if(time < 10) {
            time = '0' + time;
            return time; 
        } else {
            return time;
        }
    }

    hour = checkTime(hour);
    min = checkTime(min);

    str = `${day} ${hour}:${min}`;
    return str;
}

(function() {
    function startTime() {
        let now = new Date();
        let day = now.getDayName();
        day = shortenDay(day);
        hour = now.getHours();
        min = now.getMinutes();
    
        let str = formatDateAndTime(day, hour, min);
        document.querySelector('.time').innerHTML = str;

        setTimeout(function() {
            startTime();
        }, 500);
    }
    startTime();
})();


        










