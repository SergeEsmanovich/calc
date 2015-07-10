/* 
 * Калькулятор осещенности
 */


function Calc() {
    //Параметры помезения-----------------
    //длинна м
    this.length = 5;
    //ширина м
    this.width = 10;
    //высота м
    this.height = 5;
    //площадь м^2
    this.area = function () {
        return this.length * this.width;
    };
    //Коэффициенты отражения пол, стена, пол % они пока не тут а выше
    this.reflections = [70, 50, 20];
    //параметр по умолчению
    this.reflection = 1;
//Таблица коэффициентов отражения для ЖСП07-70-001:
    this.table = new Array(
            new Array(50, 33, 27, 32, 30, 26, 22, 22),
            new Array(57, 41, 33, 39, 37, 33, 32, 28),
            new Array(61, 46, 38, 44, 42, 38, 37, 33),
            new Array(66, 53, 44, 50, 47, 43, 43, 39),
            new Array(69, 57, 48, 53, 50, 47, 46, 42),
            new Array(73, 62, 52, 58, 54, 51, 50, 47),
            new Array(75, 66, 56, 61, 57, 54, 54, 50),
            new Array(77, 70, 59, 64, 59, 57, 56, 53),
            new Array(79, 73, 61, 66, 61, 59, 58, 55),
            new Array(80, 75, 63, 68, 62, 61, 60, 57)

            );


    //=====================================
    //Параметры освещения------------------
    //средняя освещенность
    this.medium_light = 300;
    //Коэффициент запаса
    /* 
     *Коэффициент запаса
     */
    this.safety_factor = 1.4;
    //Коэффициент эксплуатации
    this.service_factor = 0.71;
    // высота рабочей плоскости, м
    this.height_working_plane = 0.8;
    //=====================================
    //Световой прибор----------------------
    //высота светильника
    this.lamp_height = 0.43;
    //высота подвеса светильника
    this.lamp_location_height = 0;
    //Суммарный световой поток ламп, лм
    this.total_luminous_flux = 6600;
    //Мощность лампочки
    this.lamp_power = 89;
    //Стоимость
    this.lamp_cost = 5995;


    //=====================================
    //Загрузка данных
    this.load_data = function (object_lamp) {
        this.lamp_height = object_lamp.lamp_height;
        //   this.lamp_location_height = object_lamp.lamp_location_height;
        this.total_luminous_flux = object_lamp.total_luminous_flux;
        this.lamp_power = object_lamp.lamp_power;
        this.lamp_cost = object_lamp.cost
    }


    //Объем помещения
    this.space = function () {
        return   this.height * this.length * this.width;
    }
    //Расчетная высота
    this.rated_altitude = function () {
        return  this.height - this.height_working_plane - this.lamp_location_height - this.lamp_height;
    }
    //индекс помещения
    this.index_area = function () {
        return this.area() / (this.rated_altitude() * (this.length + this.width));
    }
    //Коэффициент использования
    this.factor_use = function () {
        //брать из листа ки
        var table_index = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
        var index_area = this.index_area();
        var result_array = [];
        var min = 0;
        var index = 0;
        for (var i = 0; i < table_index.length; i++) {
            var abs = Math.abs(table_index[i] - index_area);

            if ((min > abs) || (min == 0)) {
                min = abs;
                index = i;
            }
            result_array.push(abs);
        }
        //Получили приближение по таблице table_index[index]; по сути тут нужен только индекс 
        //дальше ищем его в таблице reflections_factors которую нужно создать 
        //на входе принимаем индекс по i выбранный из списка пользователем size_index
        // console.log(this.table[index][this.reflection]);
        return this.table[index][this.reflection];
    }
    //Количество светильников
    this.col_lamp = function () {
        return   Math.ceil((100 * this.medium_light * this.safety_factor * this.area()) / (this.total_luminous_flux * this.factor_use()));
    }
    //Суммарная мощность осветительной установки, кВт
    this.power = function () {
        return this.col_lamp() * this.lamp_power * 0.001;
    }
    //Суммарная стоимость светильников
    this.cost_lamps = function () {
        return this.col_lamp() * this.lamp_cost;
    }


    this.calculate = function () {
        var log = [];
        var result = [];
        console.log('начинаю вычислять');

        // console.log('Расчетная высота = ' + this.rated_altitude());
        log.push('Расчетная высота = ' + this.rated_altitude());
        result.push(this.rated_altitude().toFixed(2));
        
        //Площадь помещения
        result.push(this.area());

        // console.log('Индекс помещения = ' + this.index_area());
        log.push('Индекс помещения = ' + this.index_area());
        result.push(this.index_area().toFixed(2));

        //   console.log('Коэффициент использования,% = ' + this.factor_use());
        log.push('Коэффициент использования,% = ' + this.factor_use());
        result.push(this.factor_use());

        // console.log('Количество светильников, шт = ' + this.col_lamp());
        log.push('Количество светильников, шт = ' + this.col_lamp());
        result.push(this.col_lamp());

        //  console.log('Суммарная мощность Осветительной установки, кВт = ' + this.power());
        log.push('Суммарная мощность Осветительной установки, кВт = ' + this.power());
        result.push(this.power().toFixed(2));

        //   console.log('Стоимость = ' + this.cost_lamps());
        log.push('Стоимость = ' + this.cost_lamps());
        result.push(accounting.formatNumber(this.cost_lamps()));

        console.log(log);
        console.log('закончил вычислять');
        // return log;
        return result;
    }



}