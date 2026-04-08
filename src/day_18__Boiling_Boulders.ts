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
 * 
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
 * ------------------------------------------------------------------------------------------
 *  X2Y2Z2     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 * 
 * Checking Air-Pockets
 *  Air Pockets               - Count   0  non connected sides 0
 * 
 * ------------------------------------------------------------------------------------------
 *  X1Y2Z2         L         -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X1Y1Z2       B L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y3Z2     A   L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X0Y2Z2         L         -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X1Y2Z1         L     B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z3         L   F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets               - Count   0  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X3Y2Z2           R       -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X3Y1Z2       B   R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y3Z2     A     R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X4Y2Z2           R       -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X3Y2Z1           R   B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z3           R F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets               - Count   0  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y1Z2       B           -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y0Z2       B           -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X3Y1Z2       B   R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y1Z2       B L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y1Z1       B       B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y1Z3       B     F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets               - Count   0  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y3Z2     A             -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y4Z2     A             -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X3Y3Z2     A     R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y3Z2     A   L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z1     A         B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z3     A       F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets               - Count   0  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y2Z1               B   -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y1Z1       B       B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z1     A         B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z1           R   B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z1         L     B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y2Z0               B   -  6 Sides -   1 con. Sides = 5 non connected sides
 *  Air Pockets               - Count   0  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y2Z3             F B   -  6 Sides -   2 con. Sides = 4 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y1Z3       B     F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z3     A       F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z3           R F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z3         L   F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets               - Count   0  non connected sides 4
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y2Z4             F     -  6 Sides -   1 con. Sides = 5 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y1Z4       B       B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z4     A         B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z4           R   B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z4         L     B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *  Air Pockets           B   - Count   1  non connected sides 4
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y2Z6                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y1Z6       B     F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z6     A       F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z6           R F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z6         L   F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *   -> X2Y2Z7             F     -  6 Sides -   1 con. Sides = 5 non connected sides
 *  Air Pockets         F     - Count   1  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X1Y2Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X1Y1Z5       B L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y3Z5     A   L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *   -> X0Y2Z5         L         -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X1Y2Z4         L     B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y2Z6         L   F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets     L         - Count   1  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X3Y2Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X3Y1Z5       B   R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y3Z5     A     R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X4Y2Z5           R       -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *   -> X3Y2Z4           R   B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X3Y2Z6           R F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets       R       - Count   1  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y1Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y0Z5       B           -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *   -> X3Y1Z5       B   R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y1Z5       B L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y1Z4       B       B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y1Z6       B     F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets   B           - Count   1  non connected sides 5
 * 
 * ------------------------------------------------------------------------------------------
 *  X2Y3Z5                   -  6 Sides -   0 con. Sides = 6 non connected sides
 * 
 * Checking Air-Pockets
 *   -> X2Y2Z5     A B L R F B   -  6 Sides -   6 con. Sides = 0 non connected sides
 *   -> X2Y4Z5     A             -  6 Sides -   1 con. Sides = 5 non connected sides
 *   -> X3Y3Z5     A     R       -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X1Y3Z5     A   L         -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z4     A         B   -  6 Sides -   2 con. Sides = 4 non connected sides
 *   -> X2Y3Z6     A       F     -  6 Sides -   2 con. Sides = 4 non connected sides
 *  Air Pockets A             - Count   1  non connected sides 5
 * 
 * Result Part 1 = 64 non connected sides
 * Result Part 2 = 58
 * 
 * Day 18 - Ende
 * 
 * 
 * 
 */

type PropertieMapCube = Record< string, Cube >;

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
    
    public getCubeAbove() : Cube 
    {
        return new Cube( this.x + "," + ( this.y - 1 ) + "," + this.z );
    }

    public getCubeBelow() : Cube 
    {
        return new Cube( this.x + "," + ( this.y + 1 ) + "," + this.z );
    }

    public getCubeRight() : Cube 
    {
        return new Cube( ( this.x - 1 ) + "," + this.y + "," + this.z );
    }

    public getCubeLeft() : Cube 
    {
        return new Cube( ( this.x + 1 ) + "," + this.y + "," + this.z );
    }

    public getCubeFront() : Cube 
    {
        return new Cube( this.x + "," + this.y + "," + ( this.z - 1 ) );
    }

    public getCubeBehind() : Cube 
    {
        return new Cube( this.x + "," + this.y + "," + ( this.z + 1 ) );
    }

    public checkNeighboursP1( pMap : PropertieMapCube, pPrefix : string = "" ) : number
    {
        let debug_string : string = " " + pPrefix + padR( this.getKey(), 10 ) + " ";

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

    private checkAirPocketCube( pMap : PropertieMapCube, pPrefix : string = "" ) : number
    {
        /*
         * A Air-Pocket-Cube must not be a element of the Cube-Map.
         *
         * If a created temp cube, find itself in the map, 
         * 6 is returned.
         */
        if ( pMap[ this.getKey() ] !== undefined )
        {
            return 6;
        }

        return this.checkNeighboursP1( pMap, pPrefix );
    }

    public checkNeighboursP2( pMap : PropertieMapCube ) : number
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

        wl( "" );
        wl( "Checking Air-Pockets" )

        let sides_cube_above  = this.getCubeAbove().checkAirPocketCube( pMap, " -> " );
        let sides_cube_below  = this.getCubeBelow().checkAirPocketCube( pMap, " -> " );
        let sides_cube_left   = this.getCubeLeft().checkAirPocketCube(  pMap, " -> " );
        let sides_cube_right  = this.getCubeRight().checkAirPocketCube( pMap, " -> " );
        let sides_cube_front  = this.getCubeFront().checkAirPocketCube( pMap, " -> " );
        let sides_cube_behind = this.getCubeBehind().checkAirPocketCube( pMap, " -> " );


        debug_string = " Air Pockets ";

        let sides_air_pocket = 0;

        if ( sides_cube_above  === 0 ) { sides_air_pocket++; debug_string += "A " } else { debug_string += "  "}
        if ( sides_cube_below  === 0 ) { sides_air_pocket++; debug_string += "B " } else { debug_string += "  "}
        if ( sides_cube_left   === 0 ) { sides_air_pocket++; debug_string += "L " } else { debug_string += "  "}
        if ( sides_cube_right  === 0 ) { sides_air_pocket++; debug_string += "R " } else { debug_string += "  "}
        if ( sides_cube_front  === 0 ) { sides_air_pocket++; debug_string += "F " } else { debug_string += "  "}
        if ( sides_cube_behind === 0 ) { sides_air_pocket++; debug_string += "B " } else { debug_string += "  "}

        debug_string += "  - Count " + padL( sides_air_pocket, 3 ) + "  non connected sides " + ((6 - cube_sides_connected) - sides_air_pocket);

        wl( debug_string );

        return (6 - cube_sides_connected) - sides_air_pocket;
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

    let coords_map       : PropertieMapCube = {};
    let coords_vec       : Cube[]           = [];

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
        result_part_01 += cur_cube.checkNeighboursP1( coords_map );
    }

    wl( "" );
    wl( "" );

    for ( let cur_cube of coords_vec )
    {
        wl( "------------------------------------------------------------------------------------------")

        result_part_02 += cur_cube.checkNeighboursP2( coords_map );

        wl( "" );
        wl( "" );
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

// 3336 to high
wl( "" )
wl( "Day 18 - Ende" );
