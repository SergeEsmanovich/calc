<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>



        <?php
        //var_dump(setlocale(LC_ALL,0)); 
        $Filepath = 'ДСП77-150-001_4620014038682.xlsx';
        require('excel_reader2.php');
        require('SpreadsheetReader.php');

        try {
            $files = scandir(iconv("UTF-8", "cp1251", 'reflections'));
//            echo '<pre>';
//            print_r($files);
////            echo $name = htmlentities($files[5], ENT_QUOTES, cp1251);
////            echo '<br>';
////            echo $file = mb_convert_encoding($name, 'cp1251', 'utf8');
////
//            echo '</pre>';
            $db = array();
            foreach ($files as $key => $value) {
                $Filepath = 'reflections/' . $value;
                if (is_file($Filepath)) {
                    $info = pathinfo($Filepath);

                    $Spreadsheet = new SpreadsheetReader($Filepath);
                    $BaseMem = memory_get_usage();
                    $Sheets = $Spreadsheet->Sheets();
                    $result = array();
                    foreach ($Sheets as $Index => $Name) {
                        $Time = microtime(true);
                        $Spreadsheet->ChangeSheet($Index);
                        foreach ($Spreadsheet as $Key => $Row) {
                            if ($Key > 2) {
                                unset($Row[0]);
                                unset($Row[1]);
                                unset($Row[10]);
                                $result[] = array_values($Row);
                            }
                        }
                    }
                    $db[iconv("cp1251", "UTF-8", $info['filename'])] = $result;
                }
            }
        } catch (Exception $E) {
            echo $E->getMessage();
        }

//        echo '<pre>';
//        print_r();
//        echo '</pre>';
        file_put_contents('db.json', json_encode($db))
        ?>

    </body>
</html>
