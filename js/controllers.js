'use strict';


/* Controllers */
var calcControllers = angular.module('calcControllers', [], function ($httpProvider) {
    // Используем x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    // Переопределяем дефолтный transformRequest в $http-сервисе
    $httpProvider.defaults.transformRequest = [function (data) {
            /**
             * рабочая лошадка; преобразует объект в x-www-form-urlencoded строку.
             * @param {Object} obj
             * @return {String}
             */
            var param = function (obj) {
                var query = '';
                var name, value, fullSubName, subValue, innerObj, i;
                for (name in obj) {
                    value = obj[name];
                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
});
calcControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope', 'DB', 'DBheader', '$timeout', '$filter',
    function ($scope, $http, $rootScope, DB, DBheader, $timeout, $filter) {


        $scope.db = new DB();
        $scope.db.load();
        $scope.DBheader = new DBheader();
        $scope.DBheader.load();
        var busy = false;
        $scope.$watch('DBheader.power', function (newValue, oldValue) {
            $scope.area.pribor = null;
            //bullet time
            if (!busy) {
                busy = true
                $timeout(function () {
                    $scope.DBheader.filtr();
                    busy = false;
                }, 2000);
            }
        });
        $scope.$watch('area.seria', function (newValue, oldValue) {
            $scope.area.pribor = null;
            $scope.DBheader.image = $scope.DBheader.content[0].image;
            //bullet time
            if (!busy) {
                busy = true
                $timeout(function () {
                    $scope.DBheader.filtr_seria(newValue);
                    busy = false;
                }, 500);
            }
        });
        $scope.$watch('area.pribor', function (newValue, oldValue) {
            $scope.DBheader.calculation = [];
            angular.forEach($scope.DBheader.content, function (value) {
                if (value.id == newValue) {
                    $scope.DBheader.calculation.push(value);
                    $scope.DBheader.image = value.image;
                }
            });
            if ($scope.DBheader.calculation.length > 0) {
                var gr = 1 * $scope.DBheader.calculation[0].gr - 1;

                var RKZ = $scope.area.type == 0 ? $scope.RKZ[gr][$scope.area.pollution] : $scope.RKZO[gr][$scope.area.pollution];
                console.log('(' + gr + ',' + $scope.area.pollution + ')');
                console.log(RKZ);
                $scope.area.safety_factor = RKZ.kz;
                $scope.area.service_factor = RKZ.ke;
            }

        });
        var orderBy = $filter('orderBy');
        $scope.order = function (predicate, reverse) {
            $scope.DBheader.calculation = orderBy($scope.DBheader.calculation, predicate, reverse);
        };

        $scope.$watch('area.pollution', function (newValue, oldValue) {
            $scope.area.usage_RKZ = true;
            if ($scope.area.pribor) {
                var gr = 1 * $scope.DBheader.calculation[0].gr - 1;
                var RKZ = $scope.area.type == 0 ? $scope.RKZ[gr][$scope.area.pollution] : $scope.RKZO[gr][$scope.area.pollution];
                console.log('(' + gr + ',' + $scope.area.pollution + ')');
                console.log(RKZ);
                $scope.area.safety_factor = RKZ.kz;
                $scope.area.service_factor = RKZ.ke;
            }
        }, true);
        $scope.$watch('area.type', function (newValue, oldValue) {
            if ($scope.area.pribor) {
                $scope.area.pollution = 0;
                var gr = 1 * $scope.DBheader.calculation[0].gr - 1;
                var RKZ = $scope.area.type == 0 ? $scope.RKZ[gr][$scope.area.pollution] : $scope.RKZO[gr][$scope.area.pollution];
                console.log('(' + gr + ',' + $scope.area.pollution + ')');
                console.log(RKZ);
                $scope.area.safety_factor = RKZ.kz;
                $scope.area.service_factor = RKZ.ke;
            }
        });

        $scope.$watch('area.safety_factor', function (newValue, oldValue) {
            $scope.area.usage_RKZ = false;
        });
        $scope.$watch('area.service_factor', function (newValue, oldValue) {
            $scope.area.usage_RKZ = false;
        });




        $scope.area = {
            lamp_location_height: {focus: 0, val: 0},
            length: {focus: 0, val: 10},
            width: {focus: 0, val: 5},
            height: {focus: 0, val: 5},
            power: [120, 300],
            medium_light: 300,
            safety_factor: 0.4,
            service_factor: 0.71,
            height_working_plane: 0,
            reflection: 3,
            location: 1,
            seria: null,
            pribor: null,
            type: 0,
            pollution: 2,
            usage_RKZ: true
        };

        $scope.pollution = [
            {name: 'Высокое (более 5 мг/м3 пыли, дыма, копоти)',
                type: 0
            },
            {name: 'Среднее (1-5 мг/м3 пыли, дыма, копоти)',
                type: 0
            },
            {name: 'Низкое (менее 1 мг/м3 пыли, дыма, копоти)',
                type: 0
            },
            {name: 'Химическое (пары щелочей или кислот)',
                type: 0
            },
            {name: 'Чистое (обслуживание светильников с технического этажа)',
                type: 0
            },
            {name: 'Чистое (обслуживание светильников снизу из помещения)',
                type: 0
            },
            {name: 'Пыль, сырость, жар',
                type: 1
            },
            {name: 'Нормальные условия',
                type: 1
            }
        ];

        /*
         * Допустим есть светильник 3-й группы
         * pollution = 0;
         * Нужно найти значения для 0 и 3-й гр
         * по сути матрица
         */
        $scope.RKZ = new Array(
//Высокое (более 5 мг/м3 пыли, дыма, копоти)  
//Среднее (1-5 мг/м3 пыли, дыма, копоти)   
//Низкое (менее 1 мг/м3 пыли, дыма, копоти)
//Химическое (пары щелочей или кислот)
//Чистое (обслуживание светильников с технического этажа)
//Чистое (обслуживание светильников снизу из помещения)
                new Array({kz: 2, ke: 0.5, c: 18}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.5, ke: 0.67, c: 4}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe1
                new Array({kz: 2, ke: 0.5, c: 18}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.5, ke: 0.67, c: 4}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe2
                new Array({kz: 2, ke: 0.5, c: 18}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.5, ke: 0.67, c: 4}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe3
                new Array({kz: 2, ke: 0.5, c: 18}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.5, ke: 0.67, c: 4}, {kz: 1.8, ke: 0.56, c: 6}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe4
                new Array({kz: 1.7, ke: 0.59, c: 6}, {kz: 1.6, ke: 0.63, c: 4}, {kz: 1.4, ke: 0.71, c: 2}, {kz: 1.6, ke: 0.63, c: 4}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe5
                new Array({kz: 1.7, ke: 0.59, c: 6}, {kz: 1.6, ke: 0.63, c: 4}, {kz: 1.4, ke: 0.71, c: 2}, {kz: 1.6, ke: 0.63, c: 4}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 2}), //groupe6
                new Array({kz: 1.6, ke: 0.63, c: 4}, {kz: 1.6, ke: 0.63, c: 2}, {kz: 1.4, ke: 0.71, c: 1}, {kz: 1.6, ke: 0.63, c: 2}, {kz: 1.3, ke: 0.77, c: 4}, {kz: 1.4, ke: 0.71, c: 4}) //groupe7
                );

        $scope.RKZO = new Array(
                new Array({kz: 1.7, ke: 0.59, c: 2}, {kz: 1.4, ke: 0.71, c: 2}),
                new Array({kz: 1.7, ke: 0.59, c: 2}, {kz: 1.4, ke: 0.71, c: 2}),
                new Array({kz: 1.7, ke: 0.59, c: 2}, {kz: 1.4, ke: 0.71, c: 2}),
                new Array({kz: 1.7, ke: 0.59, c: 2}, {kz: 1.4, ke: 0.71, c: 2}),
                new Array({kz: 1.6, ke: 0.63, c: 2}, {kz: 1.4, ke: 0.71, c: 1}),
                new Array({kz: 1.6, ke: 0.63, c: 2}, {kz: 1.4, ke: 0.71, c: 1}),
                new Array({kz: 1.6, ke: 0.63, c: 2}, {kz: 1.4, ke: 0.71, c: 1})
                );







        $scope.selected = function (a, b) {
            console.log(a);
            console.log(b);
            if (a == b)
                return 1;
            return  0;
        }
        var lamps = [{
                id: 1,
                cat_name: 'Промышленные светильники типа "колокол"',
                series: 'ЖСП07',
                name: 'ЖСП07-70-001',
                position: 'p1',
                total_luminous_flux: 6600,
                count: 1,
                lamp_height: 0.43,
                lamp_power: 89,
                cost: 5995,
                file: 'ЖСП07-70-001_р1_4620014038781.хlsx'
            }];
        $scope.reflections = ['80,80,30', '80,50,30', '80,30,10', '70,50,20', '50,50,10', '50,30,10', '30,30,10', '0,0,0'];
        $scope.j = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
        $scope.help_material_table = [
            {name: 'Гипсокартон белый', ref: 80, active: [0, 0, 1]},
            {name: 'Штукатурка', ref: 73, active: [0, 1, 0]},
            {name: 'Плитка подвесного потолка белая', ref: 70, active: [1, 0, 0]},
            {name: 'Плитка подвесного потолка светло-серая', ref: 50, active: [0, 0, 1]},
            {name: 'Обои (желтые, бежевые, розовые)', ref: 50, active: [0, 1, 0]},
            {name: 'Обои (красные, коричневые)', ref: 20, active: [1, 0, 0]},
            {name: 'Плитка однотонная светлая', ref: 30, active: [0, 0, 1]},
            {name: 'Ламинат светлый (ясень)', ref: 50, active: [0, 0, 1]},
            {name: 'Паркетная доска светлая', ref: 30, active: [0, 1, 0]},
            {name: 'Линолеум светло-серый', ref: 20, active: [1, 0, 0]},
            {name: 'Паркетная доска темная', ref: 10, active: [1, 0, 0]},
            {name: 'Ковролин однотонный серый', ref: 10, active: [0, 0, 1]}
        ];




        var calc = new Calc();
        calc.load_data(lamps[0]);
        calc.calculate();
        $scope.calculate = function () {

            if ($scope.area.pribor == null) {
                $scope.DBheader.calculation = [];
                angular.forEach($scope.DBheader.content, function (value) {
                    $scope.DBheader.calculation.push(value);
                    //  $scope.DBheader.image = value.image;
                });
            }

            if ($scope.area.length.val)
                calc.length = $scope.area.length.val;

            if ($scope.area.width.val)
                calc.width = $scope.area.width.val;

            if ($scope.area.height.val)
                calc.height = $scope.area.height.val;

            if ($scope.area.lamp_location_height.val)
                calc.lamp_location_height = $scope.area.lamp_location_height.val;

            if ($scope.area.medium_light)
                calc.medium_light = $scope.area.medium_light;

            if ($scope.area.safety_factor)
                calc.safety_factor = $scope.area.safety_factor;

            if ($scope.area.service_factor)
                calc.service_factor = $scope.area.service_factor;

            if (typeof $scope.area.reflection !== 'undefined')
                calc.reflection = $scope.area.reflection;

            if (typeof $scope.area.height_working_plane !== 'undefined')
                calc.height_working_plane = $scope.area.height_working_plane;

            if ($scope.DBheader.calculation.length == 0)
                $scope.DBheader.calculation = $scope.DBheader.content;

            $scope.allresult = [];

            angular.forEach($scope.DBheader.calculation, function (value) {
                value.table = [];
                value.keys = [];
//                value.safety_factor = $scope.area.safety_factor;
                var allresult = [];


                angular.forEach($scope.db.items, function (v, key) {

                    if ((key.indexOf(value.article) !== -1)) {
                        var temp_key = key.replace(' ', '');
                        var temp_name = value.name.replace(' ', '');
                        if (temp_key.indexOf(temp_name) !== -1) {
                            value.table.push(v);
                            value.keys.push(key);
                            calc.table = v;

                            //Использование таблиц для КЗ КЕ
                            if ($scope.area.usage_RKZ) {
                                var gr = 1 * value.gr - 1;
                                var RKZ = $scope.area.type == 0 ? $scope.RKZ[gr][$scope.area.pollution] : $scope.RKZO[gr][$scope.area.pollution];
                                value.RKZ = RKZ;

                                value.safety_factor = calc.safety_factor = RKZ.kz;
                                value.service_factor = calc.service_factor = RKZ.ke;
                            } else {
                                value.safety_factor = calc.safety_factor = $scope.area.safety_factor;
                                value.service_factor = calc.service_factor = $scope.area.service_factor;
                            }

                            //Мощность лампочки
                            value.lamp_power = 1 * $scope.DBheader.get_power_lamp(value.power_lamp_id);
                            calc.lamp_power = value.lamp_power;
                            //Световой поток
                            calc.total_luminous_flux = value.total_luminous_flux;

                            var result = calc.calculate();
//                        if (value.location) {
//                            value.location = value.location == 'p1' ? 'p1' : 'p2';
//                        }
                            allresult.push(result);


                        } else {
                            console.log('Не совпадение по имени!');
                            console.log(value.name);
                            console.log(key);
                        }
                    }
                });


                value.result = allresult;


//                
//                value.col_lamp = $scope.result[4];
//                value.summ_power = $scope.result[5];


            });


            $scope.deepCopy = function (obj) {
                if (typeof obj != "object") {
                    return obj;
                }

                var copy = obj.constructor();
                for (var key in obj) {
                    if (typeof obj[key] == "object") {
                        copy[key] = this.deepCopy(obj[key]);
                    } else {
                        copy[key] = obj[key];
                    }
                }
                return copy;
            };




            var temp = [];
            for (var i = 0; i < $scope.DBheader.calculation.length; i++) {
                var item = $scope.DBheader.calculation[i];
                if (item.result.length > 0) {
                    for (var j = 0; j < item.result.length; j++) {
                        item.col_lamp = item.result[j][4];
                        item.summ_power = item.result[j][5];
                        if (item.location == 'p1') {
                            item.location = j == 0 ? 'p1' : 'p2';
                        } else {
                            if (item.location == 'p2')
                                item.location = j == 0 ? 'p2' : 'p1';
                        }

                        temp.push($scope.deepCopy(item));
                    }
                } else {
                    temp.push($scope.deepCopy(item));
                }
            }
            $scope.DBheader.calculation = [];
            $scope.DBheader.calculation = temp;

            $scope.order('summ_power', false);
            $scope.view_result = 1;
        }

//        $scope.help_material = false;
//        $scope.toggle_help_material = function () {
//            $scope.help_material = $scope.help_material === false ? true : false;
//        };
//        $scope.standart = false;
//        $scope.toggle_standart = function () {
//            $scope.standart = $scope.standart === false ? true : false;
//        };
//        $scope.load_standart = function (item) {
//            if (item == 1)
//                $scope.st_activ_1 = true;
//            else
//                $scope.st_activ_1 = false;
//            if (item == 2)
//                $scope.st_activ_2 = true;
//            else
//                $scope.st_activ_2 = false;
//        }
//        $scope.active_standart = function(){
//            if($scope.st_active_1)
//        }


    }]);
