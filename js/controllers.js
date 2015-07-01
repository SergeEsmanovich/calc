'use strict';

/*DB*/

//var db = openDatabase('documents', '1.0', 'Offline document storage', 5 * 1024 * 1024, function (db) {
//    db.changeVersion('', '1.0', function (t) {
//        t.executeSql('CREATE TABLE docids (id, name)');
//    }, error);
//});
//
//
//db.transaction(function (t) {
//    t.executeSql("INSERT INTO docids (id,name) values(?, ?)", [2, "mytest"], null, null);
//    t.executeSql("SELECT * FROM docids", [], function (t, result) {
//        console.log(result);
//        for (var i = 0; i < result.rows.length; i++) {
//            console.log(result.rows.item(i));
//        }
//    }, null);
//
//});
//var Peer = require('peerjs').Peer;

// peer.on('open', function (id) {
//            // $('#pid').text(id);
//        //    $scope.log = id;
//        });


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







calcControllers.controller('HomeCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {

        $scope.step = 1;
        $scope.next_step = function () {
            $scope.step += 1;
        }
        $scope.prev_step = function () {
            $scope.step -= 1;
        }




        $scope.area = {
            lamp_location_height: {focus: 0, val: 0.43},
            length: {focus: 0, val: 10},
            width: {focus: 0, val: 5},
            height: {focus: 0, val: 5},
            medium_light: 300,
            safety_factor: 4,
            service_factor: 71,
            height_working_plane: 0,
            reflection: 3
        };

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
        $scope.area.reflection = 3;


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





        //Раздел
        $scope.section = [
            'Промышленные светильники типа «колокол»',
            'Линейные промышленные светильники',
            'Светодиодные промышленные светильники'
        ];

        $scope.seria = [
            {text: 'ГСП07', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ЖСП07', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ГСП17', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ЖСП17', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ГСП07', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ЖСП47', groupe: 'Промышленные светильники типа «колокол»'},
            {text: 'ЛСП61', groupe: 'Линейные промышленные светильники'},
            {text: 'ЛСП41', groupe: 'Линейные промышленные светильники'},
            {text: 'ДСП09', groupe: 'Светодиодные промышленные светильники'},
        ];
        $scope.pribor = [
            'суммарный световой поток всех ламп в световом приборе (nFл)',
            'тип ламп',
            'высота светильника  (hсв)',
            'мощность СП (Pсв)',
            'стоимость светильника (Ссв)',
        ];

        $scope.location = [
            'p1 (положение 1)',
            'p2 (положение 2)'
        ];

        $scope.active_1 = 'active';
        $scope.active_2 = '';
        $scope.send_active = function (id) {
            if (id == 1) {
                $scope.active_1 = 'active';
                $scope.active_2 = '';
            } else {
                $scope.active_1 = '';
                $scope.active_2 = 'active';
            }

        }



//        var reflections_factors = [];
//        for (var ii = 0; ii < $scope.i.length; ii++) {
//            reflections_factors[ii] = [];
//            for (var jj = 0; jj < $scope.j.length; jj++) {
//                reflections_factors[ii][jj] = 0;
//            }
//        }
//
//        reflections_factors[0][0] = 50;
//        reflections_factors[0][1] = 33;
//        reflections_factors[0][2] = 27;
//        reflections_factors[0][3] = 32;
        //и тд


        var calc = new Calc();
        calc.load_data(lamps[0]);
        calc.calculate();


        $scope.calculate = function () {
            // alert('пока рано');
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
                calc.safety_factor = $scope.area.safety_factor / 10;
            if ($scope.area.service_factor)
                calc.service_factor = $scope.area.service_factor / 100;
            if (typeof $scope.area.reflection !== 'undefined')
                calc.reflection = $scope.area.reflection;

            if (typeof $scope.area.height_working_plane !== 'undefined')
                calc.height_working_plane = $scope.area.height_working_plane / 100;

            $scope.result = calc.calculate();

        }

        $scope.help_material = false;
        $scope.toggle_help_material = function () {
            $scope.help_material = $scope.help_material === false ? true : false;
        };

        $scope.standart = false;
        $scope.toggle_standart = function () {
            $scope.standart = $scope.standart === false ? true : false;
        };
        $scope.load_standart = function (item) {
            if (item == 1)
                $scope.st_activ_1 = true;
            else
                $scope.st_activ_1 = false;
            if (item == 2)
                $scope.st_activ_2 = true;
            else
                $scope.st_activ_2 = false;
        }
//        $scope.active_standart = function(){
//            if($scope.st_active_1)
//        }


    }]);
