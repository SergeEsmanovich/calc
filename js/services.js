'use strict';

/* Services */

var calcServices = angular.module('calcServices', []);
calcServices.factory("DB", ['$http',
    function ($http) {
        var service = function () {
            this.items = [];
        };
        service.prototype.load = function () {
            var url = 'db/db.json';

            $http({method: 'GET', url: url})
                    .success(function (data, status, headers, config) {
                        this.items = data;
                    }.bind(this))
                    .error(function (data, status, headers, config) {
                        console.log(data);
                    });



        }



        return service;
    }
]);


calcServices.factory("DBheader", ['$http',
    function ($http) {
        var service = function () {
            this.items = [];
            this.relation_db = [];
            this.section = [];
            this.seria = [];
            this.filtred_seria = [];
            this.type_lamp = [];
            this.ip = [];
            //Набор светильников
            this.content = [];
            this.power_lamp = [];
            this.temp = {
                type_lamp: [],
                ip: [],
                power_lamp: [],
                seria: [],
                name: []
            };
            this.type_lamp_checked = [];
            this.ip_begin;
            this.ip_end;
            this.power = [10, 400];
            this.image = 'http://placehold.it/520x300';
            this.disable_sel_name = 1;

            this.id = {
                relation_db: {id: 0},
                type_lamp: {id: 0},
                ip: {id: 0},
                power_lamp: {id: 0},
                seria: {id: 0}
            }
            this.location = [];

            this.area = {
                lamp_location_height: {focus: 0, val: 0.43},
                length: {focus: 0, val: 10},
                width: {focus: 0, val: 5},
                height: {focus: 0, val: 5},
                power: [120, 300],
                medium_light: 300,
                safety_factor: 4,
                service_factor: 71,
                height_working_plane: 0,
                reflection: 3,
                location: 1,
                seria: null,
                pribor: null
            };

        };

        service.prototype.filtr = function () {
            //чистим контент
            this.content = [];
            this.filtred_seria = [];
            this.disable_sel_name = 1;

            //Смотрим подходящие лампочки по мощности
            var power_lamps_id_filtr = [];
            angular.forEach(this.power_lamp, function (value, key) {
                if ((value.power >= this.power[0]) && (value.power <= this.power[1]))
                    power_lamps_id_filtr.push(value.id);
            }.bind(this));


            //фильтруем степень защиты
            if ((this.ip_begin !== undefined) || (this.ip_end !== undefined)) {
                var ipfiltr = [];
                angular.forEach(this.ip, function (value, key) {
                    if ((value.item >= this.ip_begin) && (value.item <= this.ip_end))
                        ipfiltr.push(value.id);
                }.bind(this));
            }
            //набираем контент
            angular.forEach(this.relation_db, function (value, key) {
                //Если отмечены чекбоксы заполняем массив лампочек с фильтром
                if (this.type_lamp_checked.indexOf(value.type_lamp_id) !== -1) {
                    //заполняем с той степенбю защиты которая подходит 
                    if (ipfiltr != undefined) {
                        if (ipfiltr.indexOf(value.ip_id) !== -1) {
                            if (power_lamps_id_filtr.indexOf(value.power_lamp_id) !== -1) {
                                this.content.push(value);
                            }
                        }
                    } else {
                        if (power_lamps_id_filtr.indexOf(value.power_lamp_id) !== -1) {
                            this.content.push(value);
                        }
                    }
                }
                //Если нет отмеченных чекбоксов выводим все лампочки
                if (this.type_lamp_checked.length == 0) {
                    //заполняем с той степенбю защиты которая подходит 
                    if (ipfiltr != undefined) {
                        if (ipfiltr.indexOf(value.ip_id) !== -1) {
                            if (power_lamps_id_filtr.indexOf(value.power_lamp_id) !== -1) {
                                this.content.push(value);
                            }
                        }
                    } else {
                        if (power_lamps_id_filtr.indexOf(value.power_lamp_id) !== -1) {
                            this.content.push(value);
                        }
                    }

                }



            }.bind(this));

            var filtr_seria = [];
            angular.forEach(this.content, function (value, key) {
                if (filtr_seria.indexOf(value.seria_id) == -1)
                    filtr_seria.push(value.seria_id);
            }.bind(this));
            angular.forEach(this.seria, function (value, key) {
                if (filtr_seria.indexOf(value.id) >= 0)
                    this.filtred_seria.push(value);
            }.bind(this));



        }


        service.prototype.filtr_seria = function (id) {
            this.filtr();
            var temp = [];
            angular.forEach(this.content, function (value, key) {
                if (value.seria_id == id)
                    temp.push(value);
            }.bind(this));
            this.content = temp;
            this.disable_sel_name = 0;
        }




        service.prototype.ip_begin_valid = function () {
            this.ip_begin = this.ip_begin < 0 ? 0 : this.ip_begin;
            this.ip_begin = this.ip_begin > 99 ? 99 : this.ip_begin;

            this.filtr();
        }
        service.prototype.ip_end_valid = function () {
            this.ip_end = this.ip_end < 0 ? 0 : this.ip_end;
            this.ip_end = this.ip_end > 99 ? 99 : this.ip_end;
            this.filtr();
        }


        service.prototype.type_lamp_check = function (id) {
            var index = this.type_lamp_checked.indexOf(id);
            if (index == -1) {
                this.type_lamp_checked.push(id);
            } else {
                this.type_lamp_checked.splice(index, 1);
            }
            this.filtr();
        }
        service.prototype.get_type_lamp = function (id) {
            for (var i = 0; i < this.type_lamp.length; i++) {
                if (id == this.type_lamp[i].id)
                    return this.type_lamp[i].name;
            }
        }
        service.prototype.get_power_lamp = function (id) {
            for (var i = 0; i < this.power_lamp.length; i++) {
                if (id == this.power_lamp[i].id)
                    return this.power_lamp[i].power;
            }
        }

        service.prototype.load = function () {
            var url = 'db/dbheader.json';

            $http({method: 'GET', url: url})
                    .success(function (data, status, headers, config) {
                        this.items = data;
                        var id = 0;
                        var find_id = function (item) {
                            return  this.section[this.temp3.indexOf(item)].id;
                        }.bind(this);

                        angular.forEach(this.items, function (value, key) {
                            var rel_db = {};

                            //Тип лампы
                            if (this.temp.type_lamp.indexOf(value[1]) == -1) {
                                this.temp.type_lamp.push(value[1]);
                                this.id.type_lamp.id += 1;
                                this.type_lamp.push({id: this.id.type_lamp.id, name: value[1]});

                                this.id.relation_db.id += 1;
                                rel_db.id = this.id.relation_db.id;
                                rel_db.type_lamp_id = this.id.type_lamp.id;
                            } else {

                                var type_lamp_id = this.temp.type_lamp.indexOf(value[1]) + 1;
                                this.id.relation_db.id += 1;
                                rel_db.id = this.id.relation_db.id;
                                rel_db.type_lamp_id = type_lamp_id;
                            }
                            //Степень защиты
                            if (this.temp.ip.indexOf(value[16]) == -1) {
                                this.temp.ip.push(value[16]);
                                this.id.ip.id += 1;
                                this.ip.push({id: this.id.ip.id, item: value[16]});

                                rel_db.ip_id = this.id.ip.id;
                            } else {
                                var ip_id = this.temp.ip.indexOf(value[16]) + 1;
                                rel_db.ip_id = ip_id;
                            }
                            //Мощность светильника
                            if (this.temp.power_lamp.indexOf(value[13]) == -1) {
                                this.temp.power_lamp.push(value[13]);
                                this.id.power_lamp.id += 1;
                                this.power_lamp.push({id: this.id.power_lamp.id, power: value[13]});

                                rel_db.power_lamp_id = this.id.power_lamp.id;
                            } else {
                                var power_lamp_id = this.temp.power_lamp.indexOf(value[13]) + 1;
                                rel_db.power_lamp_id = power_lamp_id;
                            }
                            //Серия
                            if (this.temp.seria.indexOf(value[2]) == -1) {
                                this.temp.seria.push(value[2]);
                                this.id.seria.id += 1;
                                this.seria.push({id: this.id.seria.id, seria: value[2], groupe: value[0]});

                                rel_db.seria_id = this.id.seria.id;
                            } else {
                                var seria_id = this.temp.seria.indexOf(value[2]) + 1;
                                rel_db.seria_id = seria_id;
                            }

                            //Строим реляционную базу
                            rel_db.name = value[4];
                            rel_db.image = value[14];
                            rel_db.article = value[6];
                            rel_db.location = value[5];
                            rel_db.total_luminous_flux = 1*value[8].replace(',','.');
                            if (this.temp.name.indexOf(value[4]) == -1) {
                                this.temp.name.push(value[4]);
                                this.relation_db.push(rel_db);
                                this.content.push(rel_db);
                            }

                        }.bind(this));

                        this.filtr();


                    }.bind(this))
                    .error(function (data, status, headers, config) {
                        console.log(data);
                    });



        }



        return service;
    }
]);