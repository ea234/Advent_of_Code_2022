import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day18
 * 
 * https://www.reddit.com/r/adventofcode/comments/zoqhvy/2022_day_18_solutions/
 * 
 * 
 * C:\Program Files\nodejs\node.exe .\dist\day18\day_18__Boiling_Boulders.js
 * 
 * Day 18 - Boiling Boulders
 * 
 *  X2Y2Z2     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *  X1Y2Z2         L         -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X3Y2Z2           R       -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X2Y1Z2       B           -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X2Y3Z2     A             -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X2Y2Z1               B   -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X2Y2Z3             F B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *  X2Y2Z4             F     -  6 Sides -   1 con. Sides = 5 non connected sides
 *  X2Y2Z6                   -  6 Sides -   0 con. Sides = 6 non connected sides
 *  X1Y2Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 *  X3Y2Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 *  X2Y1Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 *  X2Y3Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Result Part 1 = 64 non connected sides
 * Result Part 2 = 0
 * 
 * Day 18 - Ende
 * 
 */

type PropertieMap = Record< string, Cube >;

class Cube 
{
    x : number = 0;

    y : number = 0;

    z : number = 0;

    constructor( pInput : string )
    {
        let [ x_string, y_string, z_string ] = pInput.trim().split( "," );

        this.x = parseInt( x_string! );
        this.y = parseInt( y_string! );
        this.z = parseInt( z_string! );
    }

    public getKey() : string 
    {
        return "X" + this.x + "Y" + this.y + "Z" + this.z;
    }

    public getKeyAbove() : string 
    {
        return "X" + this.x + "Y" + ( this.y - 1 ) + "Z" + this.z;
    }

    public getKeyBelow() : string 
    {
        return "X" + this.x + "Y" + ( this.y + 1 ) + "Z" + this.z;
    }

    public getKeyRight() : string 
    {
        return "X" + ( this.x - 1 ) + "Y" + this.y + "Z" + this.z;
    }

    public getKeyLeft() : string 
    {
        return "X" + ( this.x + 1 ) + "Y" + this.y + "Z" + this.z;
    }

    public getKeyFront() : string 
    {
        return "X" + this.x + "Y" + this.y + "Z" + ( this.z - 1 );
    }

    public getKeyBehind() : string 
    {
        return "X" + this.x + "Y" + this.y + "Z" + ( this.z + 1 );
    }

    public checkNeighbours( pMap : PropertieMap ) : number
    {
        let debug_string : string = " " + padR( this.getKey(), 10 ) + " ";

        let cube_sides_connected = 0;

        if ( pMap[ this.getKeyAbove()  ] !== undefined ) { cube_sides_connected++; debug_string += "A " } else { debug_string += "  "}
        if ( pMap[ this.getKeyBelow()  ] !== undefined ) { cube_sides_connected++; debug_string += "B " } else { debug_string += "  "}
        if ( pMap[ this.getKeyLeft()   ] !== undefined ) { cube_sides_connected++; debug_string += "L " } else { debug_string += "  "}
        if ( pMap[ this.getKeyRight()  ] !== undefined ) { cube_sides_connected++; debug_string += "R " } else { debug_string += "  "}
        if ( pMap[ this.getKeyFront()  ] !== undefined ) { cube_sides_connected++; debug_string += "F " } else { debug_string += "  "}
        if ( pMap[ this.getKeyBehind() ] !== undefined ) { cube_sides_connected++; debug_string += "B " } else { debug_string += "  "}

        debug_string += "  -  6 Sides - " + padL( cube_sides_connected, 3 ) + " con. Sides = " + ( 6 - cube_sides_connected ) + " non connected sides";

        wl( debug_string );

        return 6 - cube_sides_connected;
    }

    public toString() : string 
    {
        return "x " + padL( this.x, 4 ) + "   y " + padL( this.y, 4 ) + "   z " + padL( this.z, 4 );
    }
}


function wl( pString : string )
{
    console.log( pString );
}


function padL( pInput : string | number, pPadLeft : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadLeft )
    { 
        str_result = " " + str_result;
    }

    return str_result;
}


function padR( pInput : string | number, pPadRight : number ) : string 
{
    let str_result : string = pInput.toString();

    while ( str_result.length < pPadRight )
    { 
        str_result = str_result + " ";
    }

    return str_result;
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    /*
     * *******************************************************************************************************
     * Creating Cubes from Input-Array
     * *******************************************************************************************************
     */
    let result_part_01   : number = 0;
    let result_part_02   : number = 0;

    let coords_map       : PropertieMap = {};
    let coords_vec       : Cube[]       = [];

    for ( const cur_input_str of pArray ) 
    {
        let new_cube = new Cube( cur_input_str )
        
        coords_vec.push( new_cube );

        coords_map[ new_cube.getKey() ] = new_cube;
    }

    wl( "" );

    /*
     * *******************************************************************************************************
     * Calculating non connected sides and sum them up
     * *******************************************************************************************************
     */
    for ( let cur_cube of coords_vec )
    {
        result_part_01 += cur_cube.checkNeighbours( coords_map );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 + " non connected sides ");
    wl( "Result Part 2 = " + result_part_02 );
    wl( "" );
    wl( "" );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    //const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day18_input.txt";
    const filePath: string = "c:/Daten/aoc2022_d18_input.txt";

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

    array_test.push( "2,2,2" );
    array_test.push( "1,2,2" );
    array_test.push( "3,2,2" );
    array_test.push( "2,1,2" );
    array_test.push( "2,3,2" );
    array_test.push( "2,2,1" );
    array_test.push( "2,2,3" );
    array_test.push( "2,2,4" );
    array_test.push( "2,2,6" );
    array_test.push( "1,2,5" );
    array_test.push( "3,2,5" );
    array_test.push( "2,1,5" );
    array_test.push( "2,3,5" );

    return array_test;
}


wl( "" );
wl( "Day 18 - Boiling Boulders" );
wl( "" );

calcArray( getTestArray1(), true );

//checkReaddatei();

wl( "" )
wl( "Day 18 - Ende" );
