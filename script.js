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



function DateController() {
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

    setInitialDate();

    let day = parseInt(dayInput.value);
    let month = parseInt(monthInput.value);
    let year = parseInt(yearInput.value);

    yearInput.setAttribute("max", date.getFullYear()); //set max to year dynamically

    function setInitialDate() {
        dayInput.value = today.day;
        monthInput.value = today.month;
        yearInput.value = today.year;
    }

    function validateInputAtkeyDown(evt) {
        if (evt.key != "Backspace" && evt.key != "Tab" && !evt.key.includes("Arrow"))
            if (isNaN(parseInt(evt.key)) || parseInt(evt.currentTarget.value + evt.key) > parseInt(evt.currentTarget.max) || evt.currentTarget.value.length > parseInt(evt.currentTarget.maxLength))
                return false;

        return true;
    }

    function validateDate(evt) {

        if (validateInputAtkeyDown(evt)) {
            day = evt.currentTarget.id == "day" ? parseInt(`${dayInput.value}${evt.key}`) : parseInt(dayInput.value);
            month = evt.currentTarget.id == "month" ? parseInt(`${monthInput.value}${evt.key}`) : parseInt(monthInput.value)
            year = evt.currentTarget.id == "year" ? parseInt(`${yearInput.value}${evt.key}`) : parseInt(yearInput.value)

            /*validate leap year*/

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
            /*------------------------ */

        } else {
            evt.preventDefault();
        }
    }

    const HandleErrors = (elems) => {
        return Array.from(elems).map((elem) => {
            if (isNaN(elem.value) || elem.value < parseInt(elem.attributes.min.value) || elem.value > parseInt(elem.attributes.max.value)) {
                elem.classList.add("error")
                return false;
            } else {
                return true;
            }
        })

    }

    function calculateAge() {

        document.querySelectorAll("input").forEach((elem) => elem.classList.remove("error"));
        const dateInput = document.querySelectorAll("input")

        const yearDisplay = document.querySelector(".year-wrapper .date-display")
        const monthDisplay = document.querySelector(".month-wrapper .date-display")
        const dayDisplay = document.querySelector(".day-wrapper .date-display")

        /*Verifica se inputs tem erros de data*/
        const inputResult = HandleErrors(dateInput);
        if (!inputResult.every(elem => elem == true))
            return false;

        /*---------------------------------- */

        const dtTimeAnim = document.querySelectorAll(".dt-time-animation");
        dtTimeAnim.forEach(elem => elem.classList.remove("hide"));

        const day_display = document.querySelectorAll(".date-display")
        day_display.forEach(elem => elem.textContent = "");


        /*----------Calculos para ano, mês e dia---------------- */

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

        /*---------------------------------------*/

        document.querySelectorAll(".text-clr-purple").forEach((elem) => {
            elem.classList.add("animateNumbers");
            setTimeout(() => {
                elem.classList.remove("animateNumbers");
                dtTimeAnim.forEach((elem) => elem.classList.add("hide"))
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