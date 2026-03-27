import { promises as fs } from 'fs';
import * as readline from 'readline';
import { start } from 'repl';

/*
 * https://adventofcode.com/2022/day/7
 * 
 * https://www.reddit.com/r/adventofcode/comments/zesk40/2022_day_7_solutions/
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day07/day_07__No_Space_Left_On_Device.js
 * Day 07 - No Space Left On Device
 * 
 * + changing to /
 * found cd <dir>     /
 * + changing from / to a
 * found cd <dir>     a
 * + changing from a to e
 * found cd <dir>     e
 * found cd ..
 * - changing from e to a
 * found cd ..
 * - changing from a to /
 * + changing from / to d
 * found cd <dir>     d
 * /
 *  +a
 *  + +e
 *  +d
 * 
 * Result Part 1 = 0
 * Result Part 2 = 0
 * 
 * Day 07 - Ende
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

    constructor( pString : string, pParentDirectory : Day07Directory | undefined  )
    {
        this.directory_name   = pString;
        this.directory_parent = pParentDirectory;
    }

    public getName() : string 
    {
        return this.directory_name;
    }

    public hasSubDirs() : boolean
    {
        return this.sub_directorys.length > 0;
    }

    public getSubDirCount() : number
    {
        return this.sub_directorys.length;
    }

    public getSubDir( pIndex : number ) : Day07Directory | undefined
    {
        if ( ( pIndex >= 0 ) && ( pIndex <= this.sub_directorys.length ) )
        {
            return this.sub_directorys[ pIndex ];
        }

        return undefined;
    }

    public getSubDirByName( pName : string ) : Day07Directory | undefined
    {
        if ( this.directory_name === pName ) 
        {
            return this;
        }

        for ( let sub_dir of this.sub_directorys )
        {
            let ret_val : Day07Directory | undefined = sub_dir.getSubDirByName( pName );

            if ( ret_val !== undefined )
            {
                return ret_val;
            }
        }

        return undefined;
    }

    public getStrSubDirs(  pPrefix : string = "" ) : string 
    {
        let str_result : string = pPrefix + this.directory_name + "\n";

        for ( let sub_dir of this.sub_directorys )
        {
            str_result += sub_dir.getStrSubDirs( pPrefix + " +" );
        }

        return str_result;
    }

    public addSubDir( pDir : Day07Directory ) : void 
    {
        this.sub_directorys.push( pDir );
    }

    public hasParentDir() : boolean
    {
        return this.directory_parent != undefined;
    }

    public getParentDir() : Day07Directory | undefined
    {
        return this.directory_parent;
    }

    public addFile( pString : string ) : void 
    {
        let new_file : Day07File = new Day07File( pString );

        this.directory_files.push( new_file );
    }

    public getFileSizes() : number 
    {
        let file_size : number = 0;

        for ( let file_inst of this.directory_files )
        {
            file_size += file_inst.getSize();
        }

        for ( let dir_inst of this.sub_directorys )
        {
            file_size += dir_inst.getFileSizes();
        }

        return file_size;
    }

    public toString()
    {
        return "DIR  " + this.getName;
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
    let result_part_01      : number = 0;
    let result_part_02      : number = 0;

    let start_dir : Day07Directory;

    let cur_directory : Day07Directory | undefined;
    
    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str === "$ cd ..")
        {
            wl( "found cd .." )

            if ( cur_directory !== undefined )
            {
                let new_cur_dir : Day07Directory | undefined = cur_directory.getParentDir();

                if ( new_cur_dir !== undefined )
                {
                    wl( "- changing from " + cur_directory.getName() + " to " + new_cur_dir!.getName() );

                    cur_directory = new_cur_dir;
                }
            }

        }
        else if ( cur_input_str.startsWith( "$ cd ") )
        {
            let dir_name = cur_input_str.substring( 5 ).trim();

            wl( "found cd <" + dir_name + ">" )

            if ( cur_directory !== undefined )
            {
                let new_cur_dir : Day07Directory = new Day07Directory( dir_name, cur_directory );
                
                cur_directory.addSubDir( new_cur_dir );

                wl( "+ changing from " + cur_directory.getName() + " to " + new_cur_dir.getName() );

                cur_directory = new_cur_dir;
            }
            else
            {
                cur_directory = new Day07Directory( dir_name, undefined );

                wl( "+ changing to " + cur_directory.getName() );

                start_dir = cur_directory;
            }
        }
        else if ( cur_input_str === "$ ls")
        {
            //wl( "found ls" )
        }
        else if ( cur_input_str.startsWith( "dir ") )
        {
            //wl( "found file for dir ")
        }
        else
        {
            //wl( "found file " + cur_input_str );

            cur_directory!.addFile( cur_input_str );
        }
    }

    if ( pKnzDebug )
    {
        wl( start_dir!.getStrSubDirs() );
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
