document.querySelectorAll(".navigation__link").forEach((elem)=>{
    elem.addEventListener('click', ()=> {
        document.querySelectorAll(".navigation__link").forEach((elem)=>{
            elem.classList.remove('navigation__link_current')
        })
        elem.classList.add('navigation__link_current')
        generateApp(elem.innerHTML, elem.innerHTML.split(' ').join(''))
    })
})

function generateApp(title, key) {
    const titleHtml = document.querySelector(".todo__title");
    titleHtml.innerHTML = title;

    const itemsConteiner = document.querySelector('.elements__cards');
    itemsConteiner.innerHTML = null //обнуляем все содержимое контейнера 
    let items = [];
    let itemsId = 0;
    if (localStorage.getItem(key)) {//localStorage хранит элементы в виде строки
        items = JSON.parse(localStorage.getItem(key)) //JSON.parse переводим из формата json обратно в массив
        items.forEach((elem) => {
            itemsConteiner.innerHTML +=
                //элементы генерируются со своими id
                `<li class="elements__item" data-id ${elem.id}> 
                <p class="elements__subtitle">${elem.value}</p>
                <div class="elements__buttons">
                    <button class="elements__ready" type="button" aria-label="Готово">Готово</button>
                    <button class="elements__delete" type="button" aria-label="Удалить">Удалить</button>
                </div>
            </li>`

        })
        const elements = itemsConteiner.querySelectorAll('.elements__item')
        elements.forEach((elem) => {
            elem.querySelector('.elements__ready').addEventListener('click', () => {
                doneItem(elem)
            })
            elem.querySelector('.elements__delete').addEventListener('click', () => {
                removeItem(elem)
            })
        })


    }

    const addBtn = document.querySelector(".form__submit")
    //добавить поле по клику на кнопку
    addBtn.onclick = function (event) {
        //создаю контейнер, в котором будут храниться все объекты
        const inputForm = document.querySelector(".form__input")

        if (inputForm.value.length == 0) {
            alert("Пожалуйста, введите текст")
            event.preventDefault() //останавливаю событие на стр
        } else {
            let countId = ++itemsId; //текущий id элемента, в id каждый раз будет добавляться увеличенное id элемента
            itemsConteiner.innerHTML +=
                //элементы генерируются со своими id
                `<li class="elements__item" data-id =${countId}> 
                <p class="elements__subtitle">${inputForm.value}</p>
                <div class="elements__buttons">
                    <button class="elements__ready" type="button" aria-label="Готово">Готово</button>
                    <button class="elements__delete" type="button" aria-label="Удалить">Удалить</button>
                </div>
            </li>`
            //добавляю значение, которое ввёл пользователь в конец массива
            items.push({
                value: inputForm.value,
                id: countId
            }) //передаю текущий id
            saveLocal(items, key)

            inputForm.value = null; //очищаю форму после заполнения

            //реализация функций "Удалить" и "Готово" по клику
            const elements = itemsConteiner.querySelectorAll('.elements__item')
            elements.forEach((elem) => {
                elem.querySelector('.elements__ready').addEventListener('click', () => {
                    doneItem(elem)
                })
                elem.querySelector('.elements__delete').addEventListener('click', () => {
                    removeItem(elem)
                })
            })
        }
        event.preventDefault()
        calcTasks() //вызываю функцию подсчета общего кол-ва дел
    }

    //реализовали через addEventListener, можно еще через onClick
    //реализация кнопки "удалить"
    function removeItem(elem) {
        elem.remove() //parentNode- свойство объекта, возвращает узел, который является родителем данного узла
        //(в нашем случае первый узел - elements__buttons, второй - elements__item, то что нужно удалить)
        //в html добавляем атрибут onClick="removeItem(this)"

        const idItem = elem.dataset.id; //нашли id текущего элемента
        items = items.filter((elem) => {
            return elem.id != idItem //вернуть только те элементы, id которых не равно id элементов, которые нужно удалить
        })
        itemsId = items.length; //после удаления элементов, текущему id присваивается длинна массива
        console.log(items)

        calcTasks() //вызываю функцию подсчета общего кол-ва дел
        calcTasksDone() //вызываю функцию, которая считает кол-во выполненных дел
        saveLocal(items, key) //вызываю функция, которая будет сохранять информацию в localStorage
    }
    //реализация кнопки "готово"
    function doneItem(elem) {
        elem.classList.toggle('elements__item_ready')
        calcTasksDone()
    }

    //функция, которая считает общее кол-во дел
    function calcTasks() {
        const allElem = document.querySelectorAll(".elements__item")
        const calcElem = document.querySelector(".items__num")

        calcElem.innerHTML = allElem.length;
    }

    //функция, которая считает кол-во выполненных дел
    function calcTasksDone() {
        const allElem = document.querySelectorAll(".elements__item")
        const calcElemDone = document.querySelector(".items__num-done")
        let count = 0;

        allElem.forEach((elem) => {
            if (elem.classList.contains('elements__item_ready')) {
                count++
            }
            calcElemDone.innerHTML = count
        })
    }

    //функция, которая будет сохранять информацию в localStorage
    function saveLocal(arr, key) {//сохраняет по какому-то ключу какой-то массив
        localStorage.setItem(key, JSON.stringify(arr))//JSON.stringify переводим массив с объектами в json (строчный формат)
    }
}

generateApp("Понедельник", "Понедельник")