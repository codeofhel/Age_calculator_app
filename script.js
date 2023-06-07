function DateInput(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.validateLeapYear = () => {
        if (this.year % 4 == 0 && this.year % 100 == 0 && this.year % 400 != 0)
            return false;
        else if (this.year % 4 == 0 && this.year % 100 != 0) {
            return true;
        }
    }
}



function DateController(evt) {
    const date = new Date();
    const dayInput = document.querySelector("#day");
    const monthInput = document.querySelector("#month");
    const yearInput = document.querySelector("#year");

    const monthList = {
        "january": 31,
        "february": 28,
        "march": 31,
        "april": 30,
        "may": 31,
        "june": 30,
        "july": 31,
        "august": 31,
        "september": 30,
        "october": 31,
        "november": 30,
        "december": 31
    }

    const today = {
        "day": date.getUTCDate(), //get the day of the month
        "month": date.getMonth() < 12 ? date.getMonth() + 1 : date.getMonth(),
        "year": date.getFullYear()
    }

    function setInitialDate() {
        dayInput.value = today.day;
        monthInput.value = today.month;
        yearInput.value = today.year;
    }

    setInitialDate();

    let day = parseInt(dayInput.value);
    let month = parseInt(monthInput.value);
    let year = parseInt(yearInput.value);

    yearInput.setAttribute("max", date.getFullYear());

    function validateInput(evt) {
        if (evt.key != "Backspace" && evt.key != "Tab" && !evt.key.includes("Arrow"))
            if (isNaN(parseInt(evt.key)) || parseInt(evt.currentTarget.value + evt.key) > parseInt(evt.currentTarget.max) || evt.currentTarget.value.length > parseInt(evt.currentTarget.maxLength))
                return false;

        return true;
    }

    function validateDate(evt) {

        if (validateInput(evt)) {
            day = evt.currentTarget.id == "day" ? parseInt(`${dayInput.value}${evt.key}`) : parseInt(dayInput.value);
            month = evt.currentTarget.id == "month" ? parseInt(`${monthInput.value}${evt.key}`) : parseInt(monthInput.value)
            year = evt.currentTarget.id == "year" ? parseInt(`${yearInput.value}${evt.key}`) : parseInt(yearInput.value)

            const dt = new DateInput(day, month, year);
            const monthName = Object.keys(monthList)[month - 1];

            if (day == 29 || day == 31 && year > yearInput.min) {
                if (monthName == "february" && day == 29) {
                    const realDate = dt.validateLeapYear();
                    if (!realDate) {
                        dayInput.value = 28;
                        if (evt.currentTarget.id == "day")
                            evt.preventDefault()
                    }
                } else if (day > monthList[monthName]) {
                    day = monthList[monthName];
                    if (evt.currentTarget.id == "day")
                        evt.preventDefault()
                }
            }
        } else {
            evt.preventDefault();
        }
    }

    function HandleErrors(elem) {
        if (isNaN(elem[0].value) || elem[0].value < parseInt(elem[0].attributes.min.value) || elem[0].value > parseInt(elem[0].attributes.max.value)) {
            elem[0].classList.add("error")
            return false;
        }
        return true;
    }

    function calculateAge() {

        document.querySelectorAll("input").forEach((elem) => elem.classList.remove("error"));
        const yearInput = document.querySelectorAll("#year")
        const monthInput = document.querySelectorAll("#month")
        const dayInput = document.querySelectorAll("#day")

        if (!HandleErrors(dayInput) || !HandleErrors(monthInput) || !HandleErrors(yearInput))
            return false;
        
        const yearItem = document.querySelectorAll(".year")
        const monthItem = document.querySelectorAll(".month")
        const dayItem = document.querySelectorAll(".day")
        const day_display = document.querySelectorAll(".date-display")

        yearItem.forEach(elem => elem.classList.remove("hide"));
        monthItem.forEach(elem => elem.classList.remove("hide"));
        dayItem.forEach(elem => elem.classList.remove("hide"));
        day_display.forEach(elem => elem.textContent = "");


        const yearDisplay = document.querySelector(".year-wrapper .date-display")
        const monthDisplay = document.querySelector(".month-wrapper .date-display")
        const dayDisplay = document.querySelector(".day-wrapper .date-display")

        const currentDay = new Date(`${today.year}-${today.month}-${today.day}`);

        // Data atual
        const birthdate = new Date(`${year}-${month}-${day}`);

        // Cálculo dos anos
        var anos = currentDay.getFullYear() - birthdate.getFullYear();

        // Verificação dos meses
        var meses = (currentDay.getMonth() != 11 ? currentDay.getMonth() : currentDay.getMonth()) - (birthdate.getMonth() + 1);

        // Verificação dos dias
        var dias = currentDay.getDate() - birthdate.getDate();

        // Ajuste para casos em que o mês ou o dia atual é menor que o mês ou dia de nascimento
        if (meses < 0 || (meses === 0 && dias < 0)) {
            anos--;
            if (meses < 0) {
                meses += 12;
            }
        }

        if (dias < 0) {
            var ultimoDiaMesAnterior = new Date(currentDay.getFullYear(), currentDay.getMonth(), 0).getDate();
            dias += ultimoDiaMesAnterior;
        }

        document.querySelectorAll(".text-clr-purple").forEach((elem) => {
            elem.classList.add("animateNumbers");
            setTimeout(() => {
                elem.classList.remove("animateNumbers");
                document.querySelectorAll(".year,.month,.day").forEach((elem) => elem.classList.add("hide"))
                yearDisplay.textContent = anos;
                monthDisplay.textContent = meses;
                dayDisplay.textContent = dias
            }, 2000);
        })
    }

    return {
        "validateDate": validateDate,
        "calculateAge": calculateAge
    };

}
const initialValues = DateController();

DateController()