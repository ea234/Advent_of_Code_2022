import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * https://adventofcode.com/2022/day/10
 * 
 * https://www.reddit.com/r/adventofcode/comments/zhjfo4/2022_day_10_solutions/
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day10/day_10__Cathod_Ray_Tube.js
 * 
 * Day 10 - Cathod-Ray Tube
 * 
 * Start - Cycle-Sum     0 ADD X   15  X-Register 1  Instruction addx 15 - Sprite MIN 0 MAX 2
 * Tick  - Cycle-Sum     1  X 1
 * Tick  - Cycle-Sum     2  X 1
 * End   - Cycle-Sum     2 ADD X   15  X-Register 16  Instruction addx 15
 * 
 * Start - Cycle-Sum     2 ADD X  -11  X-Register 16  Instruction addx -11 - Sprite MIN 15 MAX 17
 * Tick  - Cycle-Sum     3  X 16
 * Tick  - Cycle-Sum     4  X 16
 * End   - Cycle-Sum     4 ADD X  -11  X-Register 5  Instruction addx -11
 * 
 * Start - Cycle-Sum     4 ADD X    6  X-Register 5  Instruction addx 6 - Sprite MIN 4 MAX 6
 * Tick  - Cycle-Sum     5  X 5
 * Tick  - Cycle-Sum     6  X 5
 * End   - Cycle-Sum     6 ADD X    6  X-Register 11  Instruction addx 6
 * 
 * ...
 * 
 * Start - Cycle-Sum   237 ADD X    0  X-Register 17  Instruction noop - Sprite MIN 16 MAX 18
 * Tick  - Cycle-Sum   238  X 17
 * End   - Cycle-Sum   238 ADD X    0  X-Register 17  Instruction noop
 * 
 * Start - Cycle-Sum   238 ADD X    0  X-Register 17  Instruction noop - Sprite MIN 16 MAX 18
 * Tick  - Cycle-Sum   239  X 17
 * End   - Cycle-Sum   239 ADD X    0  X-Register 17  Instruction noop
 * 
 * Start - Cycle-Sum   239 ADD X    0  X-Register 17  Instruction noop - Sprite MIN 16 MAX 18
 * Tick  - Cycle-Sum   240  X 17
 * End   - Cycle-Sum   240 ADD X    0  X-Register 17  Instruction noop
 * 
 * END - Cycle-Sum   240 ADD X    0  X-Register 17
 * 
 * Result Part 1 = 13140
 * 
 * ##  ##  ##  ##  ##  ##  ##  ##  ##  ##
 * ###   ###   ###   ###   ###   ###   ###
 * ####    ####    ####    ####    ####
 * #####     #####     #####     #####
 * ######      ######      ######      ####
 * #######       #######       #######
 * 
 * Day 10 - Ende
 * 
 * Result Part 1 = 14420
 * 
 * ###   ##  #    ###  ###  ####  ##  #  #
 * #  # #  # #    #  # #  #    # #  # #  #
 * #  # #    #    #  # ###    #  #  # #  #
 * ###  # ## #    ###  #  #  #   #### #  #
 * # #  #  # #    # #  #  # #    #  # #  #
 * #  #  ### #### #  # ###  #### #  #  ##
 * 
 * RGLRBZAU
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
    let result_part_01      : number = 0;
    let result_part_02      : number = 0;

    let x_register_value    : number = 1;
    let cycles_sum          : number = 0;
    let cycles_instruction  : number = 0;

    let x_register_add      : number = 0;
    
    let break_point_cycles  : number = 20;
    let break_point_add     : number = 40;

    let sprite_pos_min      : number = 1;
    let sprite_pos_max      : number = 1;

    let crt_line_vector     : string[] = [];
    let crt_line_cur        : string = "";
    let crt_col_nr          : number = 0;

    let vector_break_points : number[] = [ 20, 60, 100, 140, 180, 220 ];
    
    for ( const cur_input_str of pArray ) 
    {
        if ( cur_input_str.startsWith( "addx" ) )
        {
            cycles_instruction = CYCLES_ADD_X;

            x_register_add = parseInt( cur_input_str.substring( 5 ) );
        }
        else if ( cur_input_str.startsWith( "noop" ) )
        {
            cycles_instruction = CYCLES_NOOP;

            x_register_add = 0;
        }

        /*
         * Set the sprite min and max position
         */
        sprite_pos_min = x_register_value - 1;
        sprite_pos_max = x_register_value + 1;

        if ( pKnzDebug )
        {
            wl( "" );
            wl( "Start - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value + "  Instruction "  + cur_input_str  + " - Sprite MIN " + ( sprite_pos_min  )  +  " MAX " + ( sprite_pos_max  )  );
        }

        /*
         * Do the Cycles
         */
        for ( let tick_count = 0; tick_count < cycles_instruction; tick_count++ )
        {
            /*
             * Add 1 to the cycle sum
             */
            cycles_sum++;

            /*
             * Part 1
             * If the cycle_sum hits a break point, the result for part 1 is increased.
             */
            if ( vector_break_points.includes( cycles_sum ) )
            {
               result_part_01 += ( x_register_value * cycles_sum );

                if ( pKnzDebug )
                {
                    wl( "Break - Cycle-Sum " + pad( cycles_sum, 5 ) + "  X " + x_register_value + " =  " + ( x_register_value * cycles_sum ) );
                }
            }
            else
            {
                if ( pKnzDebug )
                {
                    wl( "Tick  - Cycle-Sum " + pad( cycles_sum, 5 ) + "  X " + x_register_value  );
                }
            }

            /*
             * Part 2
             * If the crt line number is in the range of the sprite positions, * a "#" character 
             * is added to the crt_line, otherwise a " " Character is added.
             */
            if ( ( crt_col_nr >= sprite_pos_min ) && ( crt_col_nr <= sprite_pos_max ) )
            {
                crt_line_cur += "#";
            }
            else 
            {
                crt_line_cur += " ";
            }

            /*
             * Increase the crt_col_nr by one.
             */
            crt_col_nr++;

            /*
             * If the crt_col_nr reaches 40, then the current crt_line 
             * is added to the crt_line-vector. The crt_col_nr is set 
             * to 0.
            */
            if ( crt_col_nr == 40 )
            {
               crt_line_vector.push( crt_line_cur );

               crt_line_cur = "";

               crt_col_nr = 0;
            }
        }

        /*
         * After the instruction cycles the x register is increased. 
         */
        x_register_value += x_register_add;

        if ( pKnzDebug )
        {
            wl( "End   - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value + "  Instruction "  + cur_input_str );
        }
    }

    if ( pKnzDebug )
    {
        wl( "" );
        wl( "END - Cycle-Sum " + pad( cycles_sum, 5 ) + " ADD X " + pad( x_register_add, 4 ) + "  X-Register " + x_register_value );
    }

    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "" );

    for ( let val_crt of crt_line_vector )
    {
        wl( val_crt );
    }
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

calcArray( getTestArray2(), true );

checkReaddatei();

wl( "" )
wl( "Day 10 - Ende" );
