import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/7
 * 
 * https://www.reddit.com/r/adventofcode/comments/zesk40/2022_day_7_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day07/day_07__No_Space_Left_On_Device.js
 * 
 * Day 07 - No Space Left On Device
 * 
 * found cd </>
 * + changing to /
 * found file 14848514 b.txt adding to directory /
 * found file 8504156 c.dat adding to directory /
 * found cd <a>
 * + changing from / to a
 * found file 29116 f adding to directory a
 * found file 2557 g adding to directory a
 * found file 62596 h.lst adding to directory a
 * found cd <e>
 * + changing from a to e
 * found file 584 i adding to directory e
 * found cd ..
 * - changing from e to a
 * found cd ..
 * - changing from a to /
 * found cd <d>
 * + changing from / to d
 * found file 4060174 j adding to directory d
 * found file 8033020 d.log adding to directory d
 * found file 5626152 d.ext adding to directory d
 * found file 7214296 k adding to directory d
 * 
 * -- DIR  / 48381165
 *  +-- DIR  a 94853
 *  + +-- DIR  e 584
 *  +-- DIR  d 24933642
 * 
 * capacity_total         70000000
 * capacity_to_be_freed   30000000
 * capacity_root_dir      48381165
 * capacity_left          21618835
 * capacity_needed         8381165
 * 
 * DIR  / 48381165
 * capacity dir size - from 70000000 to 48381165 from directory /
 * DIR  a 94853
 * DIR  e 584
 * DIR  d 24933642
 * capacity dir size - from 48381165 to 24933642 from directory d
 * 
 * Result Part 1 = 95437
 * Result Part 2 = 24933642
 * 
 * Day 07 - Ende
 * 
 */

class Day07File
{
    name : string;
    size : number;

    constructor( pString : string )
    {
        const [ s_size, s_name ] : string[] = pString.split( " " );

        this.name = s_name!.trim();

        this.size = parseInt( s_size!.trim() );
    }

    public getSize() : number 
    {
        return this.size;
    }

    public getName() : string 
    {
        return this.name;
    }

    public toString() : string 
    {
        return "FILE " + this.name + " " + this.size;
    }
}

class Day07Directory
{
    directory_name    : string;

    directory_parent  : Day07Directory | undefined = undefined;

    sub_directorys    : Day07Directory[] = [];

    directory_files   : Day07File[] = [];

    constructor( pString : string, pParentDirectory : Day07Directory | undefined )
    {
        this.directory_name   = pString;

        this.directory_parent = pParentDirectory;
    }

    public isDirName( pName : string ) : boolean
    {
        return this.directory_name === pName;
    }

    public getDirName() : string 
    {
        return this.directory_name;
    }

    public getParentDir() : Day07Directory | undefined
    {
        return this.directory_parent;
    }

    public addSubDirectory( pDir : Day07Directory ) : void 
    {
        this.sub_directorys.push( pDir );
    }

    public addFile( pString : string ) : void 
    {
        this.directory_files.push( new Day07File( pString ) );
    }

    /*
     * not used
     */
    public getSubDirectoryByName( pName : string ) : Day07Directory | undefined
    {
        if ( this.directory_name === pName ) 
        {
            return this;
        }

        for ( let sub_directory of this.sub_directorys )
        {
            if ( sub_directory.isDirName( pName ) )
            {
                return sub_directory;
            }
        }

        return undefined;
    }

    public getStrSubDirectorys( pPrefix : string = "" ) : string 
    {
        let str_result : string = pPrefix + "-- " + this.toString() + "\n";

        for ( let sub_directory of this.sub_directorys )
        {
            str_result += sub_directory.getStrSubDirectorys( pPrefix + " +" );
        }

        return str_result;
    }

    public getDirectorySize() : number 
    {
        let file_size : number = 0;

        for ( let file_inst of this.directory_files )
        {
            file_size += file_inst.getSize();
        }

        for ( let sub_directory of this.sub_directorys )
        {
            file_size += sub_directory.getDirectorySize();
        }

        return file_size;
    }

    public toString()
    {
        return "DIR  " + this.getDirName() + " " + this.getDirectorySize();
    }
}


function wl( pString : string ) // wl = short for "writeLog"
{
    console.log( pString );
}


function pad( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while (str_result.length < pPadLeft)
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function calcArray( pArray: string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Parsing the input Array. Building the directory structure.
     * *******************************************************************************************************
     */

    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    let directory_vector : Day07Directory[] = [];

    let root_directory   : Day07Directory;

    let cur_directory    : Day07Directory | undefined;
    
    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "$ cd .." )
        {
            wl( "found cd .." );

            if ( cur_directory !== undefined )
            {
                let new_directory : Day07Directory | undefined = cur_directory.getParentDir();

                if ( new_directory !== undefined )
                {
                    wl( "- changing from " + cur_directory.getDirName() + " to " + new_directory!.getDirName() );

                    cur_directory = new_directory;
                }
            }
        }
        else if ( cur_input_str.startsWith( "$ cd " ) )
        {
            let dir_name = cur_input_str.substring( 5 ).trim();

            wl( "found cd <" + dir_name + ">" );

            /*
             * Possible Error
             * First there should be a check, wether there is a directory 
             * with the found name in the current directory.
             * 
             * Here each cd-command creates a new directory.
             * (... it works for this challenge)
             */

            if ( cur_directory !== undefined )
            {
                if ( dir_name === "/" )
                {
                    wl( "+ changing from " + cur_directory.getDirName() + " to " + root_directory!.getDirName() );

                    cur_directory = root_directory!;
                }
                else
                {
                    let new_directory : Day07Directory = new Day07Directory( dir_name, cur_directory );
                    
                    cur_directory.addSubDirectory( new_directory );

                    wl( "+ changing from " + cur_directory.getDirName() + " to " + new_directory.getDirName() );

                    cur_directory = new_directory;

                    directory_vector.push( new_directory );
                }
            }
            else
            {
                cur_directory = new Day07Directory( dir_name, undefined );

                wl( "+ changing to " + cur_directory.getDirName() );

                root_directory = cur_directory;

                directory_vector.push( cur_directory );
            }
        }
        else if ( cur_input_str === "$ ls" )
        {
            //wl( "found ls" );
        }
        else if ( cur_input_str.startsWith( "dir " ) )
        {
            //wl( "found file for dir " );
        }
        else
        {
            wl( "found file " + cur_input_str + " adding to directory " + cur_directory?.getDirName() );

            cur_directory!.addFile( cur_input_str )
        }
    }

    /*
     * *******************************************************************************************************
     * Debug: Displaying the parsed directory structure
     * *******************************************************************************************************
     */

    if ( pKnzDebug )
    {
        wl( "" );
        wl( root_directory!.getStrSubDirectorys() );
    }

    /*
     * *******************************************************************************************************
     * Calculating Part 1 - Sum up all directory-sizes, which has at most 100000 File-Size
     * 
     * Calculating Part 2 - Calculate the needed space to be freed
     *                    - Set result_part_02 to the total-capacity
     *                    - If the current dir-size is greater than the needed size but 
     *                      less than the value in result_part_02, then set the variable
     *                      result_part_02 to the current directory-size.
     *                    - This is a search in the range between total-capacity and needed capacity
     *                      And there the minimum dir size of all directorys
     * *******************************************************************************************************
     */
    
    let capacity_total       : number = 70000000;
    
    let capacity_to_be_freed : number = 30000000;

    let capacity_root_dir    : number = root_directory!.getDirectorySize();

    let capacity_left        : number = capacity_total - capacity_root_dir;

    let capacity_needed      : number = capacity_to_be_freed - capacity_left;


    wl( "" );
    wl( "capacity_total       " + pad( capacity_total,       10 ) );
    wl( "capacity_to_be_freed " + pad( capacity_to_be_freed, 10 ) );
    wl( "capacity_root_dir    " + pad( capacity_root_dir,    10 ) );
    wl( "capacity_left        " + pad( capacity_left,        10 ) );
    wl( "capacity_needed      " + pad( capacity_needed,      10 ) );
    wl( "" );

    result_part_02 = capacity_total;

    for ( const cur_directory of directory_vector )
    {
        let cur_dir_size : number = cur_directory.getDirectorySize();

        wl( cur_directory.toString() );

        if ( cur_directory.getDirectorySize() < 100000 )
        {
            result_part_01 += cur_directory.getDirectorySize();
        }

        if ( ( cur_dir_size > capacity_needed ) && ( cur_dir_size < result_part_02 ) )
        {
            wl( "capacity dir size - from " + result_part_02 + " to " + cur_dir_size + " from directory " + cur_directory.getDirName() );

            result_part_02 = cur_dir_size;
        }
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day07_input.txt";

    const lines: string[] = [];

    const fileStream = await fs.open( filePath, 'r' ).then( handle => handle.createReadStream() );

    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity } );

    for await ( const line of rl ) 
    {
        lines.push( line );
    }

    rl.close();

    fileStream.destroy();

    return lines;
}


function checkReaddatei() : void 
{
    ( async () => {

        const arrFromFile = await readFileLines();

        calcArray( arrFromFile, false );
    } )();
}


function getTestArray1() : string[] 
{
    const array_test: string[] = [];

    array_test.push( "$ cd /"         );
    array_test.push( "$ ls"           );
    array_test.push( "dir a"          );
    array_test.push( "14848514 b.txt" );
    array_test.push( "8504156 c.dat"  );
    array_test.push( "dir d"          );
    array_test.push( "$ cd a"         );
    array_test.push( "$ ls"           );
    array_test.push( "dir e"          );
    array_test.push( "29116 f"        );
    array_test.push( "2557 g"         );
    array_test.push( "62596 h.lst"    );
    array_test.push( "$ cd e"         );
    array_test.push( "$ ls"           );
    array_test.push( "584 i"          );
    array_test.push( "$ cd .."        );
    array_test.push( "$ cd .."        );
    array_test.push( "$ cd d"         );
    array_test.push( "$ ls"           );
    array_test.push( "4060174 j"      );
    array_test.push( "8033020 d.log"  );
    array_test.push( "5626152 d.ext"  );
    array_test.push( "7214296 k"      );

    return array_test;
}


wl( "Day 07 - No Space Left On Device" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 07 - Ende" );
