import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/10
 * 
 * https://www.reddit.com/r/adventofcode/comments/zhjfo4/2022_day_10_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Cathod_Ray_Tube.js
 * Day 10 - Cathod-Ray Tube
 * 
 * Start - Cycle-Sum     0 ADD X    0  X-Register 1  Instruction noop
 * Tick  - Cycle-Sum     1  X 1
 * End   - Cycle-Sum     1 ADD X    0  X-Register 1  Instruction noop
 * 
 * Start - Cycle-Sum     1 ADD X    3  X-Register 1  Instruction addx 3
 * Tick  - Cycle-Sum     2  X 1
 * Tick  - Cycle-Sum     3  X 1
 * End   - Cycle-Sum     3 ADD X    3  X-Register 4  Instruction addx 3
 * 
 * Start - Cycle-Sum     3 ADD X   -5  X-Register 4  Instruction addx -5
 * Tick  - Cycle-Sum     4  X 4
 * Tick  - Cycle-Sum     5  X 4
 * End   - Cycle-Sum     5 ADD X   -5  X-Register -1  Instruction addx -5
 * 
 * END - Cycle-Sum     5 ADD X   -5  X-Register -1
 * 
 * 
 * 
 */

const CYCLES_ADD_X : number = 2;
const CYCLES_NOOP  : number = 1;


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
    let result_part_01 : number = 0;
    let result_part_02 : number = 0;

    let x_register_value   : number = 1;
    let cycles_sum         : number = 0;
    let cycles_instruction : number = 0;

    let x_register_add : number = 0;
    
    let break_point_cycles : number = 20;
    let break_point_add    : number = 40;

    let vector_break_points : number[] = [ 20, 60, 100, 140, 180, 220 ];
    
    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.startsWith( "addx" ) )
        {
            cycles_instruction = CYCLES_ADD_X;

            x_register_add = parseInt( cur_input_str.substring( 5 ));
        }
        else if ( cur_input_str.startsWith( "noop" ) )
        {
            cycles_instruction = CYCLES_NOOP;

            x_register_add = 0;
        }

        wl( "" );
        wl( "Start - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value + "  Instruction "  + cur_input_str );

        for ( let tick_count = 0; tick_count < cycles_instruction; tick_count++ )
        {
            cycles_sum++;

            if ( vector_break_points.includes( cycles_sum ) )
            {
               result_part_01 += ( x_register_value * cycles_sum );

                wl( "Break - Cycle-Sum " + pad( cycles_sum, 5 ) + "  X " + x_register_value + " =  " + ( x_register_value * cycles_sum ) );
            }
            else
            {
                wl( "Tick  - Cycle-Sum " + pad( cycles_sum, 5 ) + "  X " + x_register_value );
            }
        }

        x_register_value += x_register_add;

        wl( "End   - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value + "  Instruction "  + cur_input_str );
    }

    wl( "" );
    wl( "END - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value );

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + result_part_02 );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day10_input.txt";

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

    array_test.push( "noop"  );
    array_test.push( "addx 3" );
    array_test.push( "addx -5"   );

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];
    
    array_test.push( "addx 15"  );
    array_test.push( "addx -11" );
    array_test.push( "addx 6"   );
    array_test.push( "addx -3"  );
    array_test.push( "addx 5"   );
    array_test.push( "addx -1"  );
    array_test.push( "addx -8"  );
    array_test.push( "addx 13"  );
    array_test.push( "addx 4"   );
    array_test.push( "noop"     );
    array_test.push( "addx -1"  );
    array_test.push( "addx 5"   );
    array_test.push( "addx -1"  );
    array_test.push( "addx 5"   );
    array_test.push( "addx -1"  );
    array_test.push( "addx 5"   );
    array_test.push( "addx -1"  );
    array_test.push( "addx 5"   );
    array_test.push( "addx -1"  );
    array_test.push( "addx -35" );
    array_test.push( "addx 1"   );
    array_test.push( "addx 24"  );
    array_test.push( "addx -19" );
    array_test.push( "addx 1"   );
    array_test.push( "addx 16"  );
    array_test.push( "addx -11" );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 21"  );
    array_test.push( "addx -15" );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx -3"  );
    array_test.push( "addx 9"   );
    array_test.push( "addx 1"   );
    array_test.push( "addx -3"  );
    array_test.push( "addx 8"   );
    array_test.push( "addx 1"   );
    array_test.push( "addx 5"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx -36" );
    array_test.push( "noop"     );
    array_test.push( "addx 1"   );
    array_test.push( "addx 7"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 2"   );
    array_test.push( "addx 6"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 7"   );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "addx -13" );
    array_test.push( "addx 13"  );
    array_test.push( "addx 7"   );
    array_test.push( "noop"     );
    array_test.push( "addx 1"   );
    array_test.push( "addx -33" );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 2"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 8"   );
    array_test.push( "noop"     );
    array_test.push( "addx -1"  );
    array_test.push( "addx 2"   );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "addx 17"  );
    array_test.push( "addx -9"  );
    array_test.push( "addx 1"   );
    array_test.push( "addx 1"   );
    array_test.push( "addx -3"  );
    array_test.push( "addx 11"  );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx -13" );
    array_test.push( "addx -19" );
    array_test.push( "addx 1"   );
    array_test.push( "addx 3"   );
    array_test.push( "addx 26"  );
    array_test.push( "addx -30" );
    array_test.push( "addx 12"  );
    array_test.push( "addx -1"  );
    array_test.push( "addx 3"   );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx -9"  );
    array_test.push( "addx 18"  );
    array_test.push( "addx 1"   );
    array_test.push( "addx 2"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 9"   );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx -1"  );
    array_test.push( "addx 2"   );
    array_test.push( "addx -37" );
    array_test.push( "addx 1"   );
    array_test.push( "addx 3"   );
    array_test.push( "noop"     );
    array_test.push( "addx 15"  );
    array_test.push( "addx -21" );
    array_test.push( "addx 22"  );
    array_test.push( "addx -6"  );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "addx 2"   );
    array_test.push( "addx 1"   );
    array_test.push( "noop"     );
    array_test.push( "addx -10" );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "addx 20"  );
    array_test.push( "addx 1"   );
    array_test.push( "addx 2"   );
    array_test.push( "addx 2"   );
    array_test.push( "addx -6"  );
    array_test.push( "addx -11" );
    array_test.push( "noop"     );
    array_test.push( "noop"     );
    array_test.push( "noop"     );

    return array_test;
}


wl( "Day 10 - Cathod-Ray Tube" );
wl( "" );

//calcArray( getTestArray2(), true );

checkReaddatei();

wl( "" )
wl( "Day 10 - Ende" );
