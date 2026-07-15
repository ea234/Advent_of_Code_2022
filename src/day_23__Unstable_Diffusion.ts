import { promises as fs } from 'fs';
import * as readline from 'readline';

/*
 * --- Day 23: Unstable Diffusion ---
 * https://adventofcode.com/2022/day23
 * 
 * https://www.reddit.com/r/adventofcode/comments/zt6xz5/2022_day_23_solutions/
 * 
 * https://github.com/ea234/Advent_of_Code_2022/blob/main/src/day_23__Unstable_Diffusion.ts
 * 
 * 
 * 
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day23/day_23__Unstable_Diffusion.js
 * 
 * Initial Map
 *      0123456
 *   0  .......
 *   1  ..AB...
 *   2  ..C....
 *   3  .......
 *   4  ..DE...
 *   5  .......
 *   6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 1
 * 
 * Elf Nr.    0 A   11002 -> 10002 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.    1 B   11003 -> 10003 N MOVE   N0 S1 W2 E0   N,S,W,E
 * Elf Nr.    2 C   12002 -> 13002 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.    3 D   14002 -> 13002 N MOVE   N0 S0 W0 E1   N,S,W,E
 * Elf Nr.    4 E   14003 -> 13003 N MOVE   N0 S0 W1 E0   N,S,W,E
 * 
 * Loop Nr.    1  Elfs moved      3
 * 
 *      0123456          23
 *   0  .......       0  AB
 *   1  ..AB...       1  ..
 *   2  ..C....       2  C.
 *   3  .......       3  .E
 *   4  ..DE...       4  D.
 *   5  .......
 *   6  .......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 2
 * 
 * Elf Nr.    0 A   10002 -> 11002 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.    1 B   10003 -> 11003 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.    2 C   12002 -> 12001 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    3 D   14002 -> 15002 S MOVE   N1 S0 W0 E1   S,W,E,N
 * Elf Nr.    4 E   13003 -> 13004 E MOVE   N1 S1 W2 E0   S,W,E,N
 * 
 * Loop Nr.    2  Elfs moved      5
 * 
 *      23          1234
 *   0  AB       1  .AB.
 *   1  ..       2  C...
 *   2  C.       3  ...E
 *   3  .E       4  ....
 *   4  D.       5  .D..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 3
 * 
 * Elf Nr.    0 A   11002 -> 10002 N MOVE   N0 S1 W1 E1   W,E,N,S
 * Elf Nr.    1 B   11003 -> 11004 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.    2 C   12001 -> 12000 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.    3 D   15002 -> 15002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    4 E   13004 -> 13004 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * Loop Nr.    3  Elfs moved      3
 * 
 *      1234          01234
 *   1  .AB.       0  ..A..
 *   2  C...       1  ....B
 *   3  ...E       2  C....
 *   4  ....       3  ....E
 *   5  .D..       4  .....
 *                 5  ..D..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 4
 * 
 * Elf Nr.    0 A   10002 -> 10002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2 C   12000 -> 12000 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    3 D   15002 -> 15002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    4 E   13004 -> 13004 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * Loop Nr.    4  Elfs moved      0
 * 
 *      01234          01234
 *   0  ..A..       0  ..A..
 *   1  ....B       1  ....B
 *   2  C....       2  C....
 *   3  ....E       3  ....E
 *   4  .....       4  .....
 *   5  ..D..       5  ..D..
 * 
 * Map Round 10
 * 
 * Round 4
 * grid_row_min 0
 * grid_col_min 0
 * grid_row_max 5
 * grid_col_max 4
 * 
 * Result Part 1 = 0
 * Result Part 2 = 4
 *  
 * Day 23 - End
 * 
 */
type PropertieMap = Record< string, string >;

const STR_COMBINE_SPACER    : string = "     ";

const MAP_CHAR_EMPTY_GROUND : string = ".";
const MAP_CHAR_ELF          : string = "#";

type GridDirection = { rel_row: number; rel_col: number };

const NORTH      : GridDirection = { rel_row : -1, rel_col :  0 };
const SOUTH      : GridDirection = { rel_row :  1, rel_col :  0 };
const EAST       : GridDirection = { rel_row :  0, rel_col :  1 };
const WEST       : GridDirection = { rel_row :  0, rel_col : -1 };

const NORTH_WEST : GridDirection = { rel_row : -1, rel_col : -1 };
const NORTH_EAST : GridDirection = { rel_row : -1, rel_col :  1 };

const SOUTH_WEST : GridDirection = { rel_row :  1, rel_col : -1 };
const SOUTH_EAST : GridDirection = { rel_row :  1, rel_col :  1 };

const cycle_orders: string[][] = [

    ['N','S','W','E'], 

    ['S','W','E','N'], 

    ['W','E','N','S'], 

    ['E','N','S','W'], 
];

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


function combineStrings( pString1: string | undefined | null, pString2: string | undefined | null ) : string 
{
    const lines1 = ( pString1 != null ? pString1.split(/\r?\n/) : [] );
    const lines2 = ( pString2 != null ? pString2.split(/\r?\n/) : [] );

    const max_lines = Math.max( lines1.length, lines2.length );

    let result : string[] = [];

    for ( let line_index = 0; line_index < max_lines; line_index++ ) 
    {
        const str_a = line_index < lines1.length ? lines1[ line_index ] : "";
        const str_b = line_index < lines2.length ? lines2[ line_index ] : "";

        result.push( str_a + STR_COMBINE_SPACER + str_b );
    }

    return result.join("\n");
}


function getDebugMap( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : string 
{
    let str_result : string = "";

    str_result += padL( " ", 3 ) + "  ";

    for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
    {
        str_result += Math.abs( cur_col ) % 10;
    }

    for ( let cur_row = pMinRows; cur_row <= pMaxRows; cur_row++ )
    {
        str_result += "\n";
        str_result += padL( cur_row, 3 ) + "  ";

        for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
        {
            str_result += pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_EMPTY_GROUND;
        }
    }

    return str_result;
}


function countChar( pMapInput : PropertieMap, pMinRows : number, pMinCols : number, pMaxRows : number, pMaxCols : number ) : number  
{
    let nr_result : number = 0;

    for ( let cur_row = pMinRows; cur_row <= pMaxRows; cur_row++ )
    {
        for ( let cur_col = pMinCols; cur_col <= pMaxCols; cur_col++ )
        {
            nr_result += ( pMapInput[ "R" + cur_row  + "C" + cur_col ] ?? MAP_CHAR_EMPTY_GROUND )  === MAP_CHAR_EMPTY_GROUND ? 1 :0;
        }
    }

    return nr_result;
}


function checkGrid( pMapInput : PropertieMap, pRow : number, pCol : number, pDirection : GridDirection ) : number
{
    /*
     * Generate the key with the relative positions from the GridDirection
     */
    let key : string = "R" + ( pRow + pDirection.rel_row ) + "C" + ( pCol  + pDirection.rel_col );

    /*
     * Check, if there is an elf at that key-position
     */
    return ( pMapInput[ key ] ?? MAP_CHAR_EMPTY_GROUND ) === MAP_CHAR_EMPTY_GROUND ? 0 : 1;
}


function checkNorth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, NORTH ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ); 
}


function checkSouth( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, SOUTH ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


function checkWest( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, WEST ) + checkGrid( pMapInput, pRow, pCol, NORTH_WEST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_WEST ); 
}


function checkEast( pMapInput : PropertieMap, pRow : number, pCol : number ) : number 
{
    return checkGrid( pMapInput, pRow, pCol, EAST ) + checkGrid( pMapInput, pRow, pCol, NORTH_EAST ) + checkGrid( pMapInput, pRow, pCol, SOUTH_EAST ); 
}


class Elf 
{
    id              : number;

    cur_row         : number = 0;
    cur_col         : number = 0;

    proposed_dir    : string = "X";
    proposed_row    : number = 0;
    proposed_col    : number = 0;

    elf_count_north : number = 0;
    elf_count_south : number = 0;
    elf_count_west  : number = 0;
    elf_count_east  : number = 0;

    cycle_nr        : number = 0;
    cycle_index     : string = "----";

    elf_char        : string ; 
    
    constructor( pID : number, pRow : number, pCol : number )
    {
        this.id = pID;

        /*
         * For debugging, set a character for the map
         */
        this.elf_char = "ABCDEFGHIJKLMNOPQRSTUVWXabcdefghijklmnop"[ this.id ] ?? MAP_CHAR_ELF;

        this.cur_row = pRow;

        this.cur_col = pCol;
    }

    public doMove1( pMapInput : PropertieMap ) : void 
    {
        /*
         * Count the number of elfes in the top, left, right and bottom row.
         */
        this.elf_count_north = checkNorth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_south = checkSouth( pMapInput, this.cur_row, this.cur_col );
        this.elf_count_west  = checkWest(  pMapInput, this.cur_row, this.cur_col );
        this.elf_count_east  = checkEast(  pMapInput, this.cur_row, this.cur_col );

        let elf_surrounding : number = this.elf_count_north + this.elf_count_south + this.elf_count_west + this.elf_count_east;

        /*
         * The initial proposed coordinates, are the current coordinates.
         */
        this.proposed_row = this.cur_row;
        this.proposed_col = this.cur_col;

        this.proposed_dir = "-";

        /*
         * If all adjacent positions are free (=no elf), then the current elf doesn't move.
         */
        if ( elf_surrounding !== 0 ) 
        {
            for ( const cycle_direction of cycle_orders[ this.cycle_nr ]! ) 
            {
                switch ( cycle_direction ) 
                {
                    case 'N':

                        if ( this.elf_count_north === 0 ) 
                        {
                            this.proposed_dir = 'N';
                            this.proposed_row--;
                        }

                        break;

                    case 'S':

                        if ( this.elf_count_south === 0 )
                        {
                            this.proposed_dir = 'S';
                            this.proposed_row++;
                        }

                        break;

                    case 'W':

                        if ( this.elf_count_west === 0 )
                        {
                            this.proposed_dir = 'W';
                            this.proposed_col--;
                        }

                        break;

                    case 'E':

                        if ( this.elf_count_east === 0 )
                        {
                            this.proposed_dir = 'E';
                            this.proposed_col++;
                        }
                }
                
                /*
                 * If a new proposed direction is found, 
                 * exit the loop.
                 */
                if ( this.proposed_dir !== '-' ) break; 
            }
        }

        /*
         * For debug purposes, get the current cycle orders
         */
        this.cycle_index = cycle_orders[ this.cycle_nr ]!.join( ',' );

        /*
         * Increase the cycle nr for the next move
         */
        this.cycle_nr++;

        /*
         * If the cycle nr is greater than 3, set it to 0.
         */
        if ( this.cycle_nr > 3 )
        {
            this.cycle_nr = 0;
        }
    }

    public doMove2( pGrid : PropertieMap, pElfArray : Elf[] ) : number  
    {
        /*
         * Check, wether any of the other elfs has the same 
         * proposed position as the current elf.
         */
        for ( const cur_elf of pElfArray ) 
        {
            if ( cur_elf.getID() !== this.id )
            {
                /*
                 * Check for equal proposed coordinates
                 */
                if ( cur_elf.getProposedCoords() === this.getProposedCoords() )
                {
                    pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = this.elf_char;
                    
                    /*
                     * The elf has not moved.
                     * 0 is returned.
                     */
                    return 0;
                }
            }
        }

        /*
         * If the proposed coordinates are the same as 
         * the current coordinates, the elf doesn't move.
         */
        if ( this.getProposedCoords() === this.getCurCoords() )
        {
            return 0;
        }

        /*
         * If no other elf has the same proposed coordinates, and the 
         * proposed coordinates differ from the  current coordinates, 
         * the elf can move to the new position.
         */

        /*
         * Clear the position in the grid
         */
        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = MAP_CHAR_EMPTY_GROUND;

        /*
         * Set the new current position 
         */
        this.cur_col = this.proposed_col;

        this.cur_row = this.proposed_row;

        /*
         * Set the elf character in the grid
         */
        pGrid[ "R" + this.cur_row + "C" + this.cur_col ] = this.elf_char;

        return 1;
    }

    public getID()
    {
        return this.id;
    }

    public getElfChar() : string 
    {
        return this.elf_char;
    }

    public getCurRow() : number
    {
        return this.cur_row;
    }

    public getCurCol() : number
    {
        return this.cur_col;
    }

    public getProposedRow() : number
    {
        return this.proposed_row;
    }

    public getProposedCol() : number
    {
        return this.proposed_col;
    }

    public getProposedCoords() : number
    {
        return 10_000 + ( this.proposed_row * 1000 ) + this.proposed_col;
    }

    public getCurCoords() : number
    {
        return 10_000 + ( this.cur_row * 1000 ) + this.cur_col;
    }

    public doesMove() : boolean 
    {
        return this.getProposedCoords() !== this.getCurCoords();
    }

    public toString() : string 
    {
        let move_knz : String = this.doesMove() ? "MOVE" : " -- ";

        return "Elf Nr. " + padL( this.id, 4 ) + " " + this.elf_char + "   " + this.getCurCoords() + " -> " + this.getProposedCoords() + " " + this.proposed_dir + " " + move_knz + "   N" + this.elf_count_north  + " S" + this.elf_count_south  + " W" + this.elf_count_west  + " E" + this.elf_count_east + "   " + this.cycle_index;
    }
}


function calcArray( pArray : string[], pKnzDebug : boolean = true ) : void 
{
    let result_part_01   : number = 0;
    
    let round_nr         : number = 1;
    let count_moved_elfs : number = 1;

    let grid_input       : PropertieMap = {};

    let grid_rows        : number = 0;
    let grid_cols        : number = pArray[0]!.length;

    let elf_array        : Elf[] = [];

    /*
     * Creating the elf array from the input and setting the 
     * initial grid positions. 
     */
    for ( const cur_input_str of pArray ) 
    {
        for ( let cur_col1 = 0; cur_col1 < cur_input_str.length; cur_col1++ ) 
        {
            let cur_char_input : string = cur_input_str[ cur_col1 ] ?? MAP_CHAR_EMPTY_GROUND;

            if ( cur_char_input === MAP_CHAR_ELF )
            {
                let cur_elf : Elf =  new Elf( elf_array.length, grid_rows, cur_col1 );

                grid_input[ "R" + grid_rows + "C" + cur_col1 ] = cur_elf.getElfChar();

                elf_array.push( cur_elf );
            }
        }

        grid_rows++;
    }

    grid_cols++;

    let dbg_map_before : string = getDebugMap( grid_input, 0, 0, grid_rows, grid_cols );

    if ( pKnzDebug )
    {
        wl( "Initial Map" );
        wl( dbg_map_before );
    }

    let grid_row_min : number = 0;
    let grid_col_min : number = 0;
    let grid_row_max : number = grid_rows;
    let grid_col_max : number = grid_cols;    

    let dbg_map_10   : string = "";

    while ( ( round_nr < 10_000 ) && ( count_moved_elfs > 0 ) )
    {
        if ( pKnzDebug )
        {
            wl( "" );
            wl( "--------------------------------------------------------------------------------" );
            wl( "Loop Nr. " + round_nr );
            wl( "" );
        } 

        /*
         * Move Part 1
         * Calculate the proposed Coordinates
         */
        for ( const cur_elf of elf_array ) 
        {
            cur_elf.doMove1( grid_input );
        }

        /*
         * If debug-modus, print the elfs status and get the before map
         */
        if ( pKnzDebug )
        {
            for ( const cur_elf of elf_array ) 
            {
                wl( cur_elf.toString() );
            }

            dbg_map_before = getDebugMap( grid_input, grid_row_min, grid_col_min, grid_row_max, grid_col_max );
        }

        /*
         * Move Part 2
         * Try to move the elfes to their new proposed coordinates
         */

        count_moved_elfs = 0;

        grid_row_min =  10_000_000;
        grid_col_min =  10_000_000;
        grid_row_max = -10_000_000;
        grid_col_max = -10_000_000;

        for ( const cur_elf of elf_array ) 
        {
            count_moved_elfs += cur_elf.doMove2( grid_input, elf_array );

            if ( cur_elf.getCurRow() < grid_row_min ) grid_row_min = cur_elf.getCurRow();

            if ( cur_elf.getCurRow() > grid_row_max ) grid_row_max = cur_elf.getCurRow();

            if ( cur_elf.getCurCol() < grid_col_min ) grid_col_min = cur_elf.getCurCol();
            
            if ( cur_elf.getCurCol() > grid_col_max ) grid_col_max = cur_elf.getCurCol();
        }

        if ( round_nr === 10 )
        {
            dbg_map_10 = getDebugMap( grid_input, grid_row_min, grid_col_min, grid_row_max, grid_col_max );

            result_part_01 = countChar( grid_input, grid_row_min, grid_col_min, grid_row_max, grid_col_max );

            wl( "" );
            wl( "Round 10" );
            wl( "grid_row_min " + grid_row_min );
            wl( "grid_col_min " + grid_col_min );
            wl( "grid_row_max " + grid_row_max );
            wl( "grid_col_max " + grid_col_max );
            wl( "" );
        }

        if ( pKnzDebug )
        {
            let dbg_map_after : string = getDebugMap( grid_input, grid_row_min, grid_col_min, grid_row_max, grid_col_max );

            wl( "" );
            wl( "Loop Nr. " + padL( round_nr, 4 ) + "  Elfs moved " + padL( count_moved_elfs, 6 ) );
            wl( "" );
            wl( combineStrings( dbg_map_before, dbg_map_after ) );
        }
        else
        {
            if (( round_nr % 10) === 0 )
            {
                wl( "Loop Nr. " + padL( round_nr, 4 ) + "  Elfs moved " + padL( count_moved_elfs, 6 ) );
            }
        }

        if ( count_moved_elfs > 0 )
        {
            round_nr++;
        }
    }

    wl( "" );
    wl( "Map Round 10" );
    wl( dbg_map_10     );
    wl( "" );
    wl( "" );
    wl( "Round " + round_nr            );
    wl( "grid_row_min " + grid_row_min );
    wl( "grid_col_min " + grid_col_min );
    wl( "grid_row_max " + grid_row_max );
    wl( "grid_col_max " + grid_col_max );
    wl( "" );
    wl( "" );
    wl( "Result Part 1 = " + result_part_01 );
    wl( "Result Part 2 = " + round_nr       );
    wl( "" );
}


async function readFileLines() : Promise<string[]> 
{
    const filePath: string = "/home/ea234/typescript/advent_of_code_2022__day23_input.txt";

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

    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( "..#..");
    array_test.push( ".....");
    array_test.push( "..##.");
    array_test.push( ".....");

    return array_test;
}


function getTestArray2() : string[] 
{
    const array_test: string[] = [];

    array_test.push( ".............." );
    array_test.push( ".............." );
    array_test.push( ".......#......" );
    array_test.push( ".....###.#...." );
    array_test.push( "...#...#.#...." );
    array_test.push( "....#...##...." );
    array_test.push( "...#.###......" );
    array_test.push( "...##.#.##...." );
    array_test.push( "....#..#......" );
    array_test.push( ".............." );
    array_test.push( ".............." );
    array_test.push( ".............." );

    return array_test;
}


wl( "" );
wl( "Day 23: Unstable Diffusion" );
wl( "" );

calcArray( getTestArray1(), true );

calcArray( getTestArray2(), true );

checkReaddatei();

wl( "" )
wl( "Day 23 - End" );
/*
 * /home/ea234/.nvm/versions/node/v20.16.0/bin/node ./dist/day23/day_23__Unstable_Diffusion.js
 * 
 * Day 23: Unstable Diffusion
 * 

 * 
 * Initial Map
 *      0123456789012345
 *   0  ................
 *   1  ................
 *   2  .......A........
 *   3  .....BCD.E......
 *   4  ...F...G.H......
 *   5  ....I...JK......
 *   6  ...L.MNO........
 *   7  ...PQ.R.ST......
 *   8  ....U..V........
 *   9  ................
 *  10  ................
 *  11  ................
 *  12  ................
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 1
 * 
 * Elf Nr.    0 A   12007 -> 11007 N MOVE   N0 S2 W1 E0   N,S,W,E
 * Elf Nr.    1 B   13005 -> 12005 N MOVE   N0 S0 W0 E1   N,S,W,E
 * Elf Nr.    2 C   13006 -> 13006 -  --    N1 S1 W1 E3   N,S,W,E
 * Elf Nr.    3 D   13007 -> 13008 E MOVE   N1 S1 W1 E0   N,S,W,E
 * Elf Nr.    4 E   13009 -> 12009 N MOVE   N0 S1 W0 E0   N,S,W,E
 * Elf Nr.    5 F   14003 -> 13003 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.    6 G   14007 -> 14007 -  --    N2 S1 W1 E1   N,S,W,E
 * Elf Nr.    7 H   14009 -> 14010 E MOVE   N1 S2 W1 E0   N,S,W,E
 * Elf Nr.    8 I   15004 -> 15004 -  --    N1 S2 W2 E1   N,S,W,E
 * Elf Nr.    9 J   15008 -> 15008 -  --    N2 S1 W2 E2   N,S,W,E
 * Elf Nr.   10 K   15009 -> 16009 S MOVE   N1 S0 W1 E0   N,S,W,E
 * Elf Nr.   11 L   16003 -> 16002 W MOVE   N1 S2 W0 E2   N,S,W,E
 * Elf Nr.   12 M   16005 -> 16005 -  --    N1 S2 W2 E2   N,S,W,E
 * Elf Nr.   13 N   16006 -> 15006 N MOVE   N0 S1 W1 E1   N,S,W,E
 * Elf Nr.   14 O   16007 -> 16007 -  --    N1 S2 W2 E2   N,S,W,E
 * Elf Nr.   15 P   17003 -> 17002 W MOVE   N1 S1 W0 E2   N,S,W,E
 * Elf Nr.   16 Q   17004 -> 17004 -  --    N2 S1 W2 E1   N,S,W,E
 * Elf Nr.   17 R   17006 -> 17006 -  --    N3 S1 W1 E2   N,S,W,E
 * Elf Nr.   18 S   17008 -> 17008 -  --    N1 S1 W2 E1   N,S,W,E
 * Elf Nr.   19 T   17009 -> 16009 N MOVE   N0 S0 W1 E0   N,S,W,E
 * Elf Nr.   20 U   18004 -> 19004 S MOVE   N2 S0 W1 E0   N,S,W,E
 * Elf Nr.   21 V   18007 -> 19007 S MOVE   N2 S0 W1 E1   N,S,W,E
 * 
 * Loop Nr.    1  Elfs moved     11
 * 
 *      0123456789012345          234567890
 *   0  ................       1  .....A...
 *   1  ................       2  ...B...E.
 *   2  .......A........       3  .F..C.D..
 *   3  .....BCD.E......       4  .....G..H
 *   4  ...F...G.H......       5  ..I.N.JK.
 *   5  ....I...JK......       6  L..M.O...
 *   6  ...L.MNO........       7  P.Q.R.ST.
 *   7  ...PQ.R.ST......       8  .........
 *   8  ....U..V........       9  ..U..V...
 *   9  ................
 *  10  ................
 *  11  ................
 *  12  ................
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 2
 * 
 * Elf Nr.    0 A   11007 -> 11007 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1 B   12005 -> 12004 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    2 C   13006 -> 13006 -  --    N1 S1 W1 E1   S,W,E,N
 * Elf Nr.    3 D   13008 -> 13008 -  --    N1 S1 W1 E1   S,W,E,N
 * Elf Nr.    4 E   12009 -> 12010 E MOVE   N0 S1 W1 E0   S,W,E,N
 * Elf Nr.    5 F   13003 -> 13003 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    6 G   14007 -> 14007 -  --    N2 S2 W2 E2   S,W,E,N
 * Elf Nr.    7 H   14010 -> 14011 E MOVE   N0 S1 W1 E0   S,W,E,N
 * Elf Nr.    8 I   15004 -> 15003 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    9 J   15008 -> 15008 -  --    N1 S1 W2 E1   S,W,E,N
 * Elf Nr.   10 K   15009 -> 16009 S MOVE   N1 S0 W1 E1   S,W,E,N
 * Elf Nr.   11 L   16002 -> 16001 W MOVE   N0 S1 W0 E0   S,W,E,N
 * Elf Nr.   12 M   16005 -> 16005 -  --    N2 S2 W2 E2   S,W,E,N
 * Elf Nr.   13 N   15006 -> 15006 -  --    N1 S2 W1 E2   S,W,E,N
 * Elf Nr.   14 O   16007 -> 16007 -  --    N2 S2 W2 E2   S,W,E,N
 * Elf Nr.   15 P   17002 -> 18002 S MOVE   N1 S0 W0 E0   S,W,E,N
 * Elf Nr.   16 Q   17004 -> 18004 S MOVE   N1 S0 W0 E1   S,W,E,N
 * Elf Nr.   17 R   17006 -> 18006 S MOVE   N2 S0 W1 E1   S,W,E,N
 * Elf Nr.   18 S   17008 -> 18008 S MOVE   N1 S0 W1 E1   S,W,E,N
 * Elf Nr.   19 T   17009 -> 18009 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.   20 U   19004 -> 19004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   21 V   19007 -> 19007 -  --    N0 S0 W0 E0   S,W,E,N
 * 
 * Loop Nr.    2  Elfs moved     11
 * 
 *      234567890          12345678901
 *   1  .....A...       1  ......A....
 *   2  ...B...E.       2  ...B.....E.
 *   3  .F..C.D..       3  ..F..C.D...
 *   4  .....G..H       4  ......G...H
 *   5  ..I.N.JK.       5  ..I..N.J...
 *   6  L..M.O...       6  L...M.O.K..
 *   7  P.Q.R.ST.       7  ...........
 *   8  .........       8  .P.Q.R.ST..
 *   9  ..U..V...       9  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 3
 * 
 * Elf Nr.    0 A   11007 -> 11007 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    1 B   12004 -> 12005 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.    2 C   13006 -> 13005 W MOVE   N0 S1 W0 E1   W,E,N,S
 * Elf Nr.    3 D   13008 -> 13009 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.    4 E   12010 -> 12010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    5 F   13003 -> 13002 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.    6 G   14007 -> 14007 -  --    N2 S2 W2 E2   W,E,N,S
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    8 I   15003 -> 15003 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    9 J   15008 -> 15008 -  --    N1 S2 W2 E1   W,E,N,S
 * Elf Nr.   10 K   16009 -> 16010 E MOVE   N1 S0 W1 E0   W,E,N,S
 * Elf Nr.   11 L   16001 -> 16001 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   12 M   16005 -> 16004 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.   13 N   15006 -> 15006 -  --    N1 S2 W1 E2   W,E,N,S
 * Elf Nr.   14 O   16007 -> 17007 S MOVE   N2 S0 W1 E1   W,E,N,S
 * Elf Nr.   15 P   18002 -> 18002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   16 Q   18004 -> 18003 W MOVE   N0 S1 W0 E0   W,E,N,S
 * Elf Nr.   17 R   18006 -> 18005 W MOVE   N0 S1 W0 E1   W,E,N,S
 * Elf Nr.   18 S   18008 -> 17008 N MOVE   N0 S1 W1 E1   W,E,N,S
 * Elf Nr.   19 T   18009 -> 18010 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.   20 U   19004 -> 19003 W MOVE   N1 S0 W0 E0   W,E,N,S
 * Elf Nr.   21 V   19007 -> 20007 S MOVE   N2 S0 W1 E1   W,E,N,S
 * 
 * Loop Nr.    3  Elfs moved     13
 * 
 *      12345678901          12345678901
 *   1  ......A....       1  ......A....
 *   2  ...B.....E.       2  ....B....E.
 *   3  ..F..C.D...       3  .F..C...D..
 *   4  ......G...H       4  ......G...H
 *   5  ..I..N.J...       5  ..I..N.J...
 *   6  L...M.O.K..       6  L..M.....K.
 *   7  ...........       7  ......OS...
 *   8  .P.Q.R.ST..       8  .PQ.R....T.
 *   9  ...U..V....       9  ..U........
 *       10  ......V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 4
 * 
 * Elf Nr.    0 A   11007 -> 11007 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   12005 -> 12006 E MOVE   N0 S1 W0 E0   E,N,S,W
 * Elf Nr.    2 C   13005 -> 13006 E MOVE   N1 S0 W0 E0   E,N,S,W
 * Elf Nr.    3 D   13009 -> 14009 S MOVE   N1 S0 W0 E1   E,N,S,W
 * Elf Nr.    4 E   12010 -> 12011 E MOVE   N0 S1 W1 E0   E,N,S,W
 * Elf Nr.    5 F   13002 -> 13002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    6 G   14007 -> 13007 N MOVE   N0 S2 W1 E1   E,N,S,W
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    8 I   15003 -> 14003 N MOVE   N0 S1 W0 E1   E,N,S,W
 * Elf Nr.    9 J   15008 -> 15009 E MOVE   N1 S0 W1 E0   E,N,S,W
 * Elf Nr.   10 K   16010 -> 16010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   11 L   16001 -> 16001 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   12 M   16004 -> 16005 E MOVE   N1 S0 W1 E0   E,N,S,W
 * Elf Nr.   13 N   15006 -> 16006 S MOVE   N1 S0 W0 E1   E,N,S,W
 * Elf Nr.   14 O   17007 -> 16007 N MOVE   N0 S0 W0 E1   E,N,S,W
 * Elf Nr.   15 P   18002 -> 17002 N MOVE   N0 S1 W0 E2   E,N,S,W
 * Elf Nr.   16 Q   18003 -> 18004 E MOVE   N0 S1 W1 E0   E,N,S,W
 * Elf Nr.   17 R   18005 -> 18005 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   18 S   17008 -> 17009 E MOVE   N0 S0 W1 E0   E,N,S,W
 * Elf Nr.   19 T   18010 -> 18010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   20 U   19003 -> 19004 E MOVE   N2 S0 W1 E0   E,N,S,W
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * Loop Nr.    4  Elfs moved     14
 * 
 *      12345678901          12345678901
 *   1  ......A....       1  ......A....
 *   2  ....B....E.       2  .....B....E
 *   3  .F..C...D..       3  .F...CG....
 *   4  ......G...H       4  ..I.....D.H
 *   5  ..I..N.J...       5  ........J..
 *   6  L..M.....K.       6  L...MNO..K.
 *   7  ......OS...       7  .P......S..
 *   8  .PQ.R....T.       8  ...QR....T.
 *   9  ..U........       9  ...U.......
 *  10  ......V....      10  ......V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 5
 * 
 * Elf Nr.    0 A   11007 -> 10007 N MOVE   N0 S1 W1 E0   N,S,W,E
 * Elf Nr.    1 B   12006 -> 12005 W MOVE   N1 S2 W0 E2   N,S,W,E
 * Elf Nr.    2 C   13006 -> 14006 S MOVE   N1 S0 W0 E1   N,S,W,E
 * Elf Nr.    3 D   14009 -> 13009 N MOVE   N0 S1 W0 E0   N,S,W,E
 * Elf Nr.    4 E   12011 -> 12011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    5 F   13002 -> 12002 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.    6 G   13007 -> 14007 S MOVE   N1 S0 W2 E0   N,S,W,E
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    8 I   14003 -> 15003 S MOVE   N1 S0 W1 E0   N,S,W,E
 * Elf Nr.    9 J   15009 -> 15008 W MOVE   N1 S1 W0 E1   N,S,W,E
 * Elf Nr.   10 K   16010 -> 16011 E MOVE   N1 S1 W2 E0   N,S,W,E
 * Elf Nr.   11 L   16001 -> 15001 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.   12 M   16005 -> 15005 N MOVE   N0 S0 W0 E1   N,S,W,E
 * Elf Nr.   13 N   16006 -> 15006 N MOVE   N0 S0 W1 E1   N,S,W,E
 * Elf Nr.   14 O   16007 -> 15007 N MOVE   N0 S0 W1 E0   N,S,W,E
 * Elf Nr.   15 P   17002 -> 18002 S MOVE   N1 S0 W1 E0   N,S,W,E
 * Elf Nr.   16 Q   18004 -> 17004 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.   17 R   18005 -> 17005 N MOVE   N0 S1 W2 E0   N,S,W,E
 * Elf Nr.   18 S   17009 -> 17008 W MOVE   N1 S1 W0 E2   N,S,W,E
 * Elf Nr.   19 T   18010 -> 19010 S MOVE   N1 S0 W1 E0   N,S,W,E
 * Elf Nr.   20 U   19004 -> 20004 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   N,S,W,E
 * 
 * Loop Nr.    5  Elfs moved     19
 * 
 *      12345678901          12345678901
 *   1  ......A....       0  ......A....
 *   2  .....B....E       1  ...........
 *   3  .F...CG....       2  .F..B.....E
 *   4  ..I.....D.H       3  ........D..
 *   5  ........J..       4  .....CG...H
 *   6  L...MNO..K.       5  L.I.MNOJ...
 *   7  .P......S..       6  ..........K
 *   8  ...QR....T.       7  ...QR..S...
 *   9  ...U.......       8  .P.........
 *  10  ......V....       9  .........T.
 *       10  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 6
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1 B   12005 -> 12005 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    2 C   14006 -> 13006 N MOVE   N0 S3 W1 E2   S,W,E,N
 * Elf Nr.    3 D   13009 -> 13009 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    4 E   12011 -> 12011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    6 G   14007 -> 13007 N MOVE   N0 S3 W2 E1   S,W,E,N
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    8 I   15003 -> 15003 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    9 J   15008 -> 16008 S MOVE   N1 S0 W2 E0   S,W,E,N
 * Elf Nr.   10 K   16011 -> 16011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   12 M   15005 -> 16005 S MOVE   N1 S0 W0 E2   S,W,E,N
 * Elf Nr.   13 N   15006 -> 16006 S MOVE   N2 S0 W1 E2   S,W,E,N
 * Elf Nr.   14 O   15007 -> 16007 S MOVE   N2 S0 W2 E1   S,W,E,N
 * Elf Nr.   15 P   18002 -> 18002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   16 Q   17004 -> 18004 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.   17 R   17005 -> 18005 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.   18 S   17008 -> 17008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   19 T   19010 -> 19010 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   S,W,E,N
 * 
 * Loop Nr.    6  Elfs moved      8
 * 
 *      12345678901          12345678901
 *   0  ......A....       0  ......A....
 *   1  ...........       1  ...........
 *   2  .F..B.....E       2  .F..B.....E
 *   3  ........D..       3  .....CG.D..
 *   4  .....CG...H       4  ..........H
 *   5  L.I.MNOJ...       5  L.I........
 *   6  ..........K       6  ....MNOJ..K
 *   7  ...QR..S...       7  .......S...
 *   8  .P.........       8  .P.QR......
 *   9  .........T.       9  .........T.
 *  10  ...U..V....      10  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 7
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    1 B   12005 -> 12004 W MOVE   N0 S1 W0 E1   W,E,N,S
 * Elf Nr.    2 C   13006 -> 14006 S MOVE   N1 S0 W1 E1   W,E,N,S
 * Elf Nr.    3 D   13009 -> 13009 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    4 E   12011 -> 12011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    6 G   13007 -> 13008 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    8 I   15003 -> 15003 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    9 J   16008 -> 16009 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.   10 K   16011 -> 16011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   12 M   16005 -> 16004 W MOVE   N0 S0 W0 E1   W,E,N,S
 * Elf Nr.   13 N   16006 -> 15006 N MOVE   N0 S0 W1 E1   W,E,N,S
 * Elf Nr.   14 O   16007 -> 15007 N MOVE   N0 S1 W1 E2   W,E,N,S
 * Elf Nr.   15 P   18002 -> 18002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   16 Q   18004 -> 18003 W MOVE   N0 S0 W0 E1   W,E,N,S
 * Elf Nr.   17 R   18005 -> 18006 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.   18 S   17008 -> 17009 E MOVE   N2 S0 W1 E0   W,E,N,S
 * Elf Nr.   19 T   19010 -> 19010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * Loop Nr.    7  Elfs moved     10
 * 
 *      12345678901          12345678901
 *   0  ......A....       0  ......A....
 *   1  ...........       1  ...........
 *   2  .F..B.....E       2  .F.B......E
 *   3  .....CG.D..       3  .......GD..
 *   4  ..........H       4  .....C....H
 *   5  L.I........       5  L.I..NO....
 *   6  ....MNOJ..K       6  ...M....J.K
 *   7  .......S...       7  ........S..
 *   8  .P.QR......       8  .PQ..R.....
 *   9  .........T.       9  .........T.
 *  10  ...U..V....      10  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 8
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   12004 -> 12004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2 C   14006 -> 13006 N MOVE   N0 S2 W0 E1   E,N,S,W
 * Elf Nr.    3 D   13009 -> 13010 E MOVE   N0 S0 W1 E0   E,N,S,W
 * Elf Nr.    4 E   12011 -> 12011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    6 G   13008 -> 12008 N MOVE   N0 S0 W0 E1   E,N,S,W
 * Elf Nr.    7 H   14011 -> 14011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    8 I   15003 -> 14003 N MOVE   N0 S1 W0 E1   E,N,S,W
 * Elf Nr.    9 J   16009 -> 16010 E MOVE   N0 S1 W0 E0   E,N,S,W
 * Elf Nr.   10 K   16011 -> 16011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   12 M   16004 -> 16005 E MOVE   N1 S0 W1 E0   E,N,S,W
 * Elf Nr.   13 N   15006 -> 16006 S MOVE   N1 S0 W0 E1   E,N,S,W
 * Elf Nr.   14 O   15007 -> 15008 E MOVE   N1 S0 W2 E0   E,N,S,W
 * Elf Nr.   15 P   18002 -> 17002 N MOVE   N0 S0 W0 E1   E,N,S,W
 * Elf Nr.   16 Q   18003 -> 18004 E MOVE   N0 S0 W1 E0   E,N,S,W
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   18 S   17009 -> 17010 E MOVE   N1 S0 W0 E0   E,N,S,W
 * Elf Nr.   19 T   19010 -> 19010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * Loop Nr.    8  Elfs moved     11
 * 
 *      12345678901          12345678901
 *   0  ......A....       0  ......A....
 *   1  ...........       1  ...........
 *   2  .F.B......E       2  .F.B...G..E
 *   3  .......GD..       3  .....C...D.
 *   4  .....C....H       4  ..I.......H
 *   5  L.I..NO....       5  L......O...
 *   6  ...M....J.K       6  ....MN...JK
 *   7  ........S..       7  .P.......S.
 *   8  .PQ..R.....       8  ...Q.R.....
 *   9  .........T.       9  .........T.
 *  10  ...U..V....      10  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 9
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    1 B   12004 -> 12004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    3 D   13010 -> 13009 W MOVE   N1 S1 W0 E2   N,S,W,E
 * Elf Nr.    4 E   12011 -> 11011 N MOVE   N0 S1 W1 E0   N,S,W,E
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    7 H   14011 -> 15011 S MOVE   N1 S0 W1 E0   N,S,W,E
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    9 J   16010 -> 15010 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.   10 K   16011 -> 15011 N MOVE   N0 S1 W2 E0   N,S,W,E
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   12 M   16005 -> 15005 N MOVE   N0 S0 W0 E1   N,S,W,E
 * Elf Nr.   13 N   16006 -> 15006 N MOVE   N0 S0 W1 E0   N,S,W,E
 * Elf Nr.   14 O   15008 -> 15008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   18 S   17010 -> 18010 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.   19 T   19010 -> 19010 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   N,S,W,E
 * 
 * Loop Nr.    9  Elfs moved      6
 * 
 *      12345678901          12345678901
 *   0  ......A....       0  ......A....
 *   1  ...........       1  ..........E
 *   2  .F.B...G..E       2  .F.B...G...
 *   3  .....C...D.       3  .....C..D..
 *   4  ..I.......H       4  ..I.......H
 *   5  L......O...       5  L...MN.O.J.
 *   6  ....MN...JK       6  ..........K
 *   7  .P.......S.       7  .P.........
 *   8  ...Q.R.....       8  ...Q.R...S.
 *   9  .........T.       9  .........T.
 *  10  ...U..V....      10  ...U..V....
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 10
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1 B   12004 -> 12004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    3 D   13009 -> 14009 S MOVE   N1 S0 W1 E0   S,W,E,N
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    6 G   12008 -> 12007 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    7 H   14011 -> 14012 E MOVE   N0 S1 W1 E0   S,W,E,N
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    9 J   15010 -> 15009 W MOVE   N1 S1 W0 E2   S,W,E,N
 * Elf Nr.   10 K   16011 -> 17011 S MOVE   N1 S0 W1 E0   S,W,E,N
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   12 M   15005 -> 16005 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.   13 N   15006 -> 16006 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.   14 O   15008 -> 15008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   18 S   18010 -> 18009 W MOVE   N0 S1 W0 E0   S,W,E,N
 * Elf Nr.   19 T   19010 -> 20010 S MOVE   N1 S0 W0 E0   S,W,E,N
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   S,W,E,N
 * 
 * Round 10
 * grid_row_min 0
 * grid_col_min 1
 * grid_row_max 10
 * grid_col_max 12
 * 
 * Loop Nr.   10  Elfs moved      9
 * 
 *      12345678901          123456789012
 *   0  ......A....       0  ......A.....
 *   1  ..........E       1  ..........E.
 *   2  .F.B...G...       2  .F.B..G.....
 *   3  .....C..D..       3  .....C......
 *   4  ..I.......H       4  ..I.....D..H
 *   5  L...MN.O.J.       5  L......OJ...
 *   6  ..........K       6  ....MN......
 *   7  .P.........       7  .P........K.
 *   8  ...Q.R...S.       8  ...Q.R..S...
 *   9  .........T.       9  ............
 *  10  ...U..V....      10  ...U..V..T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 11
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    1 B   12004 -> 12004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    2 C   13006 -> 13005 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.    3 D   14009 -> 14010 E MOVE   N0 S2 W1 E0   W,E,N,S
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    6 G   12007 -> 12008 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.    7 H   14012 -> 14012 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    9 J   15009 -> 15010 E MOVE   N1 S0 W1 E0   W,E,N,S
 * Elf Nr.   10 K   17011 -> 17011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   12 M   16005 -> 16004 W MOVE   N0 S0 W0 E1   W,E,N,S
 * Elf Nr.   13 N   16006 -> 16007 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.   14 O   15008 -> 15007 W MOVE   N1 S0 W0 E2   W,E,N,S
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   18 S   18009 -> 18009 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   19 T   20010 -> 20010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * Loop Nr.   11  Elfs moved      7
 * 
 *      123456789012          123456789012
 *   0  ......A.....       0  ......A.....
 *   1  ..........E.       1  ..........E.
 *   2  .F.B..G.....       2  .F.B...G....
 *   3  .....C......       3  ....C.......
 *   4  ..I.....D..H       4  ..I......D.H
 *   5  L......OJ...       5  L.....O..J..
 *   6  ....MN......       6  ...M..N.....
 *   7  .P........K.       7  .P........K.
 *   8  ...Q.R..S...       8  ...Q.R..S...
 *   9  ............       9  ............
 *  10  ...U..V..T..      10  ...U..V..T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 12
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   12004 -> 11004 N MOVE   N0 S1 W0 E1   E,N,S,W
 * Elf Nr.    2 C   13005 -> 13006 E MOVE   N1 S0 W1 E0   E,N,S,W
 * Elf Nr.    3 D   14010 -> 14011 E MOVE   N0 S1 W0 E0   E,N,S,W
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    7 H   14012 -> 14012 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    9 J   15010 -> 15011 E MOVE   N1 S0 W0 E0   E,N,S,W
 * Elf Nr.   10 K   17011 -> 17011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   13 N   16007 -> 16008 E MOVE   N1 S0 W0 E0   E,N,S,W
 * Elf Nr.   14 O   15007 -> 15008 E MOVE   N0 S1 W0 E0   E,N,S,W
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   18 S   18009 -> 18009 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   19 T   20010 -> 20010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * Loop Nr.   12  Elfs moved      6
 * 
 *      123456789012          123456789012
 *   0  ......A.....       0  ......A.....
 *   1  ..........E.       1  ...B......E.
 *   2  .F.B...G....       2  .F.....G....
 *   3  ....C.......       3  .....C......
 *   4  ..I......D.H       4  ..I.......DH
 *   5  L.....O..J..       5  L......O..J.
 *   6  ...M..N.....       6  ...M...N....
 *   7  .P........K.       7  .P........K.
 *   8  ...Q.R..S...       8  ...Q.R..S...
 *   9  ............       9  ............
 *  10  ...U..V..T..      10  ...U..V..T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 13
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    3 D   14011 -> 13011 N MOVE   N0 S1 W0 E1   N,S,W,E
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    7 H   14012 -> 13012 N MOVE   N0 S1 W2 E0   N,S,W,E
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    9 J   15011 -> 16011 S MOVE   N2 S0 W0 E1   N,S,W,E
 * Elf Nr.   10 K   17011 -> 17011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   13 N   16008 -> 17008 S MOVE   N1 S0 W0 E0   N,S,W,E
 * Elf Nr.   14 O   15008 -> 14008 N MOVE   N0 S1 W0 E0   N,S,W,E
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   18 S   18009 -> 18009 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   19 T   20010 -> 20010 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   N,S,W,E
 * 
 * Loop Nr.   13  Elfs moved      5
 * 
 *      123456789012          123456789012
 *   0  ......A.....       0  ......A.....
 *   1  ...B......E.       1  ...B......E.
 *   2  .F.....G....       2  .F.....G....
 *   3  .....C......       3  .....C....DH
 *   4  ..I.......DH       4  ..I....O....
 *   5  L......O..J.       5  L...........
 *   6  ...M...N....       6  ...M......J.
 *   7  .P........K.       7  .P.....N..K.
 *   8  ...Q.R..S...       8  ...Q.R..S...
 *   9  ............       9  ............
 *  10  ...U..V..T..      10  ...U..V..T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 14
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    3 D   13011 -> 14011 S MOVE   N0 S0 W0 E1   S,W,E,N
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    7 H   13012 -> 14012 S MOVE   N0 S0 W1 E0   S,W,E,N
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    9 J   16011 -> 16010 W MOVE   N0 S1 W0 E0   S,W,E,N
 * Elf Nr.   10 K   17011 -> 18011 S MOVE   N1 S0 W0 E0   S,W,E,N
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   13 N   17008 -> 17007 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   18 S   18009 -> 19009 S MOVE   N1 S0 W1 E0   S,W,E,N
 * Elf Nr.   19 T   20010 -> 20010 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   S,W,E,N
 * 
 * Loop Nr.   14  Elfs moved      6
 * 
 *      123456789012          123456789012
 *   0  ......A.....       0  ......A.....
 *   1  ...B......E.       1  ...B......E.
 *   2  .F.....G....       2  .F.....G....
 *   3  .....C....DH       3  .....C......
 *   4  ..I....O....       4  ..I....O..DH
 *   5  L...........       5  L...........
 *   6  ...M......J.       6  ...M.....J..
 *   7  .P.....N..K.       7  .P....N.....
 *   8  ...Q.R..S...       8  ...Q.R....K.
 *   9  ............       9  ........S...
 *  10  ...U..V..T..      10  ...U..V..T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 15
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    3 D   14011 -> 14010 W MOVE   N0 S0 W0 E1   W,E,N,S
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    7 H   14012 -> 14013 E MOVE   N0 S0 W1 E0   W,E,N,S
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   13 N   17007 -> 17008 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   17 R   18006 -> 18005 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.   18 S   19009 -> 19008 W MOVE   N0 S1 W0 E1   W,E,N,S
 * Elf Nr.   19 T   20010 -> 20011 E MOVE   N1 S0 W1 E0   W,E,N,S
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   21 V   20007 -> 20007 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * Loop Nr.   15  Elfs moved      6
 * 
 *      123456789012          1234567890123
 *   0  ......A.....       0  ......A......
 *   1  ...B......E.       1  ...B......E..
 *   2  .F.....G....       2  .F.....G.....
 *   3  .....C......       3  .....C.......
 *   4  ..I....O..DH       4  ..I....O.D..H
 *   5  L...........       5  L............
 *   6  ...M.....J..       6  ...M.....J...
 *   7  .P....N.....       7  .P.....N.....
 *   8  ...Q.R....K.       8  ...QR.....K..
 *   9  ........S...       9  .......S.....
 *  10  ...U..V..T..      10  ...U..V...T..
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 16
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    3 D   14010 -> 14010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    7 H   14013 -> 14013 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   13 N   17008 -> 17008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   16 Q   18004 -> 17004 N MOVE   N0 S0 W0 E1   E,N,S,W
 * Elf Nr.   17 R   18005 -> 18006 E MOVE   N0 S0 W1 E0   E,N,S,W
 * Elf Nr.   18 S   19008 -> 19009 E MOVE   N0 S1 W1 E0   E,N,S,W
 * Elf Nr.   19 T   20011 -> 20011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   21 V   20007 -> 21007 S MOVE   N1 S0 W0 E1   E,N,S,W
 * 
 * Loop Nr.   16  Elfs moved      4
 * 
 *      1234567890123          1234567890123
 *   0  ......A......       0  ......A......
 *   1  ...B......E..       1  ...B......E..
 *   2  .F.....G.....       2  .F.....G.....
 *   3  .....C.......       3  .....C.......
 *   4  ..I....O.D..H       4  ..I....O.D..H
 *   5  L............       5  L............
 *   6  ...M.....J...       6  ...M.....J...
 *   7  .P.....N.....       7  .P.Q...N.....
 *   8  ...QR.....K..       8  .....R....K..
 *   9  .......S.....       9  ........S....
 *  10  ...U..V...T..      10  ...U......T..
 *       11  ......V......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 17
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    3 D   14010 -> 14010 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    7 H   14013 -> 14013 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   12 M   16004 -> 15004 N MOVE   N0 S1 W0 E0   N,S,W,E
 * Elf Nr.   13 N   17008 -> 17008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   16 Q   17004 -> 18004 S MOVE   N1 S0 W0 E0   N,S,W,E
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   18 S   19009 -> 19009 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   19 T   20011 -> 20011 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   N,S,W,E
 * Elf Nr.   21 V   21007 -> 21007 -  --    N0 S0 W0 E0   N,S,W,E
 * 
 * Loop Nr.   17  Elfs moved      2
 * 
 *      1234567890123          1234567890123
 *   0  ......A......       0  ......A......
 *   1  ...B......E..       1  ...B......E..
 *   2  .F.....G.....       2  .F.....G.....
 *   3  .....C.......       3  .....C.......
 *   4  ..I....O.D..H       4  ..I....O.D..H
 *   5  L............       5  L..M.........
 *   6  ...M.....J...       6  .........J...
 *   7  .P.Q...N.....       7  .P.....N.....
 *   8  .....R....K..       8  ...Q.R....K..
 *   9  ........S....       9  ........S....
 *  10  ...U......T..      10  ...U......T..
 *  11  ......V......      11  ......V......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 18
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    3 D   14010 -> 14010 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    7 H   14013 -> 14013 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.    8 I   14003 -> 14002 W MOVE   N0 S1 W0 E1   S,W,E,N
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   11 L   15001 -> 15001 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   12 M   15004 -> 16004 S MOVE   N1 S0 W1 E0   S,W,E,N
 * Elf Nr.   13 N   17008 -> 17008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   18 S   19009 -> 19009 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   19 T   20011 -> 20011 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   S,W,E,N
 * Elf Nr.   21 V   21007 -> 21007 -  --    N0 S0 W0 E0   S,W,E,N
 * 
 * Loop Nr.   18  Elfs moved      2
 * 
 *      1234567890123          1234567890123
 *   0  ......A......       0  ......A......
 *   1  ...B......E..       1  ...B......E..
 *   2  .F.....G.....       2  .F.....G.....
 *   3  .....C.......       3  .....C.......
 *   4  ..I....O.D..H       4  .I.....O.D..H
 *   5  L..M.........       5  L............
 *   6  .........J...       6  ...M.....J...
 *   7  .P.....N.....       7  .P.....N.....
 *   8  ...Q.R....K..       8  ...Q.R....K..
 *   9  ........S....       9  ........S....
 *  10  ...U......T..      10  ...U......T..
 *  11  ......V......      11  ......V......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 19
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    3 D   14010 -> 14010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    7 H   14013 -> 14013 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.    8 I   14002 -> 14003 E MOVE   N0 S1 W1 E0   W,E,N,S
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   11 L   15001 -> 15000 W MOVE   N1 S0 W0 E1   W,E,N,S
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   13 N   17008 -> 17008 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   18 S   19009 -> 19009 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   19 T   20011 -> 20011 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   W,E,N,S
 * Elf Nr.   21 V   21007 -> 21007 -  --    N0 S0 W0 E0   W,E,N,S
 * 
 * Loop Nr.   19  Elfs moved      2
 * 
 *      1234567890123          01234567890123
 *   0  ......A......       0  .......A......
 *   1  ...B......E..       1  ....B......E..
 *   2  .F.....G.....       2  ..F.....G.....
 *   3  .....C.......       3  ......C.......
 *   4  .I.....O.D..H       4  ...I....O.D..H
 *   5  L............       5  L.............
 *   6  ...M.....J...       6  ....M.....J...
 *   7  .P.....N.....       7  ..P.....N.....
 *   8  ...Q.R....K..       8  ....Q.R....K..
 *   9  ........S....       9  .........S....
 *  10  ...U......T..      10  ....U......T..
 *  11  ......V......      11  .......V......
 * 
 * --------------------------------------------------------------------------------
 * Loop Nr. 20
 * 
 * Elf Nr.    0 A   10007 -> 10007 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    1 B   11004 -> 11004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    2 C   13006 -> 13006 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    3 D   14010 -> 14010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    4 E   11011 -> 11011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    5 F   12002 -> 12002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    6 G   12008 -> 12008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    7 H   14013 -> 14013 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    8 I   14003 -> 14003 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.    9 J   16010 -> 16010 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   10 K   18011 -> 18011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   11 L   15000 -> 15000 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   12 M   16004 -> 16004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   13 N   17008 -> 17008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   14 O   14008 -> 14008 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   15 P   17002 -> 17002 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   16 Q   18004 -> 18004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   17 R   18006 -> 18006 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   18 S   19009 -> 19009 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   19 T   20011 -> 20011 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   20 U   20004 -> 20004 -  --    N0 S0 W0 E0   E,N,S,W
 * Elf Nr.   21 V   21007 -> 21007 -  --    N0 S0 W0 E0   E,N,S,W
 * 
 * Loop Nr.   20  Elfs moved      0
 * 
 *      01234567890123          01234567890123
 *   0  .......A......       0  .......A......
 *   1  ....B......E..       1  ....B......E..
 *   2  ..F.....G.....       2  ..F.....G.....
 *   3  ......C.......       3  ......C.......
 *   4  ...I....O.D..H       4  ...I....O.D..H
 *   5  L.............       5  L.............
 *   6  ....M.....J...       6  ....M.....J...
 *   7  ..P.....N.....       7  ..P.....N.....
 *   8  ....Q.R....K..       8  ....Q.R....K..
 *   9  .........S....       9  .........S....
 *  10  ....U......T..      10  ....U......T..
 *  11  .......V......      11  .......V......
 * 
 * Map Round 10
 *      123456789012
 *   0  ......A.....
 *   1  ..........E.
 *   2  .F.B..G.....
 *   3  .....C......
 *   4  ..I.....D..H
 *   5  L......OJ...
 *   6  ....MN......
 *   7  .P........K.
 *   8  ...Q.R..S...
 *   9  ............
 *  10  ...U..V..T..
 * 
 * Round 20
 * grid_row_min 0
 * grid_col_min 0
 * grid_row_max 11
 * grid_col_max 13
 * 
 * Result Part 1 = 110
 * Result Part 2 = 20
 * 
 * --------------------------------------------------
 * Round 10
 * grid_row_min -4
 * grid_col_min -6
 * grid_row_max 77
 * grid_col_max 76
 * 
 * Loop Nr.   10  Elfs moved    447
 * Loop Nr.   20  Elfs moved    538
 * Loop Nr.   30  Elfs moved    623
 * Loop Nr.   40  Elfs moved    653
 * Loop Nr.   50  Elfs moved    753
 * Loop Nr.   60  Elfs moved    757
 * Loop Nr.   70  Elfs moved    814
 * Loop Nr.   80  Elfs moved    822
 * Loop Nr.   90  Elfs moved    870
 * Loop Nr.  100  Elfs moved    951
 * Loop Nr.  110  Elfs moved    982
 * Loop Nr.  120  Elfs moved   1002
 * Loop Nr.  130  Elfs moved   1000
 * Loop Nr.  140  Elfs moved   1047
 * Loop Nr.  150  Elfs moved   1060
 * Loop Nr.  160  Elfs moved   1086
 * Loop Nr.  170  Elfs moved   1082
 * Loop Nr.  180  Elfs moved   1136
 * Loop Nr.  190  Elfs moved   1162
 * Loop Nr.  200  Elfs moved   1146
 * Loop Nr.  210  Elfs moved   1232
 * Loop Nr.  220  Elfs moved   1227
 * Loop Nr.  230  Elfs moved   1219
 * Loop Nr.  240  Elfs moved   1256
 * Loop Nr.  250  Elfs moved   1270
 * Loop Nr.  260  Elfs moved   1281
 * Loop Nr.  270  Elfs moved   1330
 * Loop Nr.  280  Elfs moved   1303
 * Loop Nr.  290  Elfs moved   1332
 * Loop Nr.  300  Elfs moved   1348
 * Loop Nr.  310  Elfs moved   1339
 * Loop Nr.  320  Elfs moved   1430
 * Loop Nr.  330  Elfs moved   1407
 * Loop Nr.  340  Elfs moved   1384
 * Loop Nr.  350  Elfs moved   1406
 * Loop Nr.  360  Elfs moved   1420
 * Loop Nr.  370  Elfs moved   1391
 * Loop Nr.  380  Elfs moved   1446
 * Loop Nr.  390  Elfs moved   1424
 * Loop Nr.  400  Elfs moved   1423
 * Loop Nr.  410  Elfs moved   1390
 * Loop Nr.  420  Elfs moved   1397
 * Loop Nr.  430  Elfs moved   1360
 * Loop Nr.  440  Elfs moved   1385
 * Loop Nr.  450  Elfs moved   1362
 * Loop Nr.  460  Elfs moved   1373
 * Loop Nr.  470  Elfs moved   1350
 * Loop Nr.  480  Elfs moved   1247
 * Loop Nr.  490  Elfs moved   1263
 * Loop Nr.  500  Elfs moved   1247
 * Loop Nr.  510  Elfs moved   1290
 * Loop Nr.  520  Elfs moved   1248
 * Loop Nr.  530  Elfs moved   1190
 * Loop Nr.  540  Elfs moved   1162
 * Loop Nr.  550  Elfs moved   1157
 * Loop Nr.  560  Elfs moved   1120
 * Loop Nr.  570  Elfs moved   1130
 * Loop Nr.  580  Elfs moved   1035
 * Loop Nr.  590  Elfs moved    991
 * Loop Nr.  600  Elfs moved   1020
 * Loop Nr.  610  Elfs moved    981
 * Loop Nr.  620  Elfs moved    944
 * Loop Nr.  630  Elfs moved    912
 * Loop Nr.  640  Elfs moved    963
 * Loop Nr.  650  Elfs moved    877
 * Loop Nr.  660  Elfs moved    842
 * Loop Nr.  670  Elfs moved    789
 * Loop Nr.  680  Elfs moved    733
 * Loop Nr.  690  Elfs moved    619
 * Loop Nr.  700  Elfs moved    667
 * Loop Nr.  710  Elfs moved    624
 * Loop Nr.  720  Elfs moved    597
 * Loop Nr.  730  Elfs moved    515
 * Loop Nr.  740  Elfs moved    507
 * Loop Nr.  750  Elfs moved    454
 * Loop Nr.  760  Elfs moved    433
 * Loop Nr.  770  Elfs moved    398
 * Loop Nr.  780  Elfs moved    427
 * Loop Nr.  790  Elfs moved    422
 * Loop Nr.  800  Elfs moved    337
 * Loop Nr.  810  Elfs moved    303
 * Loop Nr.  820  Elfs moved    318
 * Loop Nr.  830  Elfs moved    223
 * Loop Nr.  840  Elfs moved    206
 * Loop Nr.  850  Elfs moved    220
 * Loop Nr.  860  Elfs moved    183
 * Loop Nr.  870  Elfs moved    136
 * Loop Nr.  880  Elfs moved    153
 * Loop Nr.  890  Elfs moved     81
 * Loop Nr.  900  Elfs moved    107
 * Loop Nr.  910  Elfs moved     72
 * Loop Nr.  920  Elfs moved     80
 * Loop Nr.  930  Elfs moved     62
 * Loop Nr.  940  Elfs moved     45
 * Loop Nr.  950  Elfs moved     20
 * Loop Nr.  960  Elfs moved     10
 * Loop Nr.  970  Elfs moved      2
 * 
 *      65432101234567890123456789012345678901234567890123456789012345678901234567890123456
 *  -4  .....................G................N........U.W...............j.k.n.o.#.........
 *  -3  ................D#.E...#.I..K.L.........OQ..........a....f...g.....................
 *  -2  ..............B......................M......RS......b...........i.......p......#...
 *  -1  .........A................J...#.#.......P.....T.V.X...c.d..#.h.............##......
 *   0  ........#.....C..###F#H.#..........#......##.#.#.#.#....#.e.....#.#.lm###..........
 *   1  ......#...#....#..#.#........#.#.###....#.#...........#.......#..#.#...#.#..#....#.
 *   2  .......#..#..#..#....#.#.#.##........#......#.#.#.#.#..#.#.#.#.#.....#..#.#...##...
 *   3  ....#....##.#..#.#.#.#...#...#.#..#.#..#.#.##.#..#.#......#.#...#.#.##.#.#..#.#..#.
 *   4  ..#.........#.#.#.#.#.#.#..##.#.#....##.#.#..#.##.#.#.#.#..#.#.#..#...#.#.#........
 *   5  .......##.#..#.#.#.#.#...#.#.#.#.#..#..#.#.#..#..#.#..#..#..#.#..#..##..#.#.##..#..
 *   6  .........#.#..###.#.#.#.#.#.#.#.#.#..#..#.#.#...#...#.#....#...#...#.###.#.#....#..
 *   7  .#...##....#.#.#...#...##.##.#.#.#.##.#..#..#..##..#..#.#.#.#.#.#.#..#..#.#...#....
 *   8  ........##..#.#.#.#.#.##.#.##.#.#......#..##.#..#.#.#..#.#...#.#.#.##..#....#....#.
 *   9  ...##...#..#.#.#.#.#.#.......#.#.#.#.#.###.##.#..#.#.##...#.#.#.#.#.#.#.#.#...#....
 *  10  ....#..#..#.#.#.#.#.#..#.##.#.....#.#.#...##.#..#.#.#..#.#.#.#.#...#.#.#.#.#.#.#..#
 *  11  .......#.#.###.#.#.#..#..#.#.#.#.#.#.#.###.##.##.#.#..#...#.#.#.#...#.#.#.#..#.....
 *  12  ...#....#.#.#.#.#.#..#..#.#.#.#.#.#.#.##..##.#..#.#......#.#...#.#.#.##.#..#.#..#..
 *  13  .....##..#.#.#.#.#.##.#..#.#.#.#.#.#.#..#.###..#.#.#.##.#.#.#.###...#..#.##........
 *  14  ..#.....#.#.#.....#..#..#.#.##.#..#.#..#.###.#..#.#..#.#.#.#.#...#.#..#.#..##..#.#.
 *  15  #...#...#..#.#.#.#.##.##.##..##.##.#.##.#..##.##.#.#.#....##..###.#..#...#..#...#..
 *  16  #.....##..#.#.#.###..#.#.###.###.####....#..##..#.#.#..#.#..#..#..#.#.#.#..#.....#.
 *  17  ....#...#..#.#.#.#..#.#.#.#.#.#.#.##.##.#.#.####.#.#.#..#.##.#.#.#.#.#.#.##..##....
 *  18  .#.....#.##.#######.#..#.#.#.#.#.#.#.#.#.#.#....#.#.####.##.#.#.#.###..#...#.#.#...
 *  19  .#.#..#.#....#.#.#..#...#.#.#..#.#.##.#..#..####.#.#.#..#..#.#.#.#.#..#.#.#.#....#.
 *  20  ......#..#.#..##..#..#.#.#..#.#.#.#..#..#.#.##.##.#.#..#.##.#.#.#..#.#.#.##.#.#...#
 *  21  ..#..#..#.#.#.#.##...#..#..#.#...#.##.##.#.#.#.#.#.##.#.#.##.#.#..#...#.#..#..#....
 *  22  .........#.#.###.#.##..#.#.#..#...#..#..#.#.#####.#..######.#.#..#.#.#.#.#..#.#.#.#
 *  23  ...###.#..#.###.#.#...#.#.######.#.##..#.#.#..####.###.#.#..##..#.#.#...#.#...#.#..
 *  24  .......#.#.#.#.#...#.#.#.#.#..#.#.#.#.###...##..#.#.###..#.###.#.#.#...#..#.#.#....
 *  25  ..#.....#.#.#.#...#.#.#.#.#..#.#.#.#..####.##.##.#...##.##.##..##.#...#.#.........#
 *  26  .....#.#.#.#.#.#.#.#.#.#.#..#.#.#.#..#..#...#.#.#.#.#.#.###.###..#.#.#.##.####.....
 *  27  ...#......#.###...#.#.#.#.#....#.#..#..#...#.#.#.#.#.#.#..###..#.#..#.#..#..##.##..
 *  28  ....#.#.#.#.#.##.#.#.#..##..#.#.#.##..#...#.#.##.##.#.##.#.##.#.#.##.#.##.#....#...
 *  29  ......#..#.#.#.##.#.#..#...#.#.#...#.#.#.#.#.#.#.#.#.#..#.#..#.##.#.#.##.#.#..#.#..
 *  30  ...#....##..#.#.#..#.###.##.#.#.#...#.#.#..##.#.#.#.#.###.#.#.#.##.#.####.#.#.#....
 *  31  ..........###..#.#..###.##.#.#.#.....#.#.##..#.#.#.#.#.#.#.#.###..#.#..###.#......#
 *  32  ....##..####.#..#.#.#.###.#.#.#.#.#.#.#..#.##.#..##.#.#.#.#.#.##.#.#.####.#.#..##..
 *  33  ....#..#.##...#..#.#.#.###.#.#.#.#.#.#.##.#.#..##..#.###.#.#.#..#.#.#.##.#..#......
 *  34  ........#..#.#..#.#..#..#.#...#.#.###.##.#.#.##.###.#.#.#.#.#.##.#.#...##.#..#.#.#.
 *  35  .........#..#.#..##.#.#.##.#.##.##.#....#.#.#.###....#.#.#.#.#.##.##...#.#...#.....
 *  36  ......###.##...##..#.#.#..#.#..#..#..##..#.#.#.#..#.#.##..#.#.#..####.###...#....#.
 *  37  ..#...#..##..#..#.#.#.###.##.#...##.#...#.#...#..#.#.#.##..#.#.##.##.#..#.#.#......
 *  38  .....#..#...#..#...#.#.#.#..#.######.##....##.#.#...#.#.....#.#..####.#..#.#...#...
 *  39  ...#.....##...#.#.#.#.####.#..##.#..#..#.#...#.#.#.#.#.##.#...###.##.#.##.#..##...#
 *  40  ........#..#.#.#.#...#.#..#.##..##.#..###.#.#.#.#.#.#....#.#.#.###..#.#..#..##..#..
 *  41  ....#.##....#.#.#...#.######.#.#..#..#####.#.#.#.#.#..#.#.#.#.#....#.######.#......
 *  42  .....#...#.#.#..##.#.#.#.#..#...##.##.#.#.#.#.#.#.#.#.#..#.#.#..#####...#.#....#...
 *  43  .......#..#.#..#..#.#.#.#.#..#.#..##.#.#.#.#...#.#.#.#..#.#.#..#.##.###...##.##....
 *  44  ....#...#..#.###.#.#.#.#.#.#..#.#..#..#...#...#..##.#.##...#..#...###..####.#.#...#
 *  45  ..#....#..#...#.#...#.#.#.#.#..#.##.##.#.#.#.#..#.#..#..#.#..#...#...#..###.#.#....
 *  46  ......#.#..#.#.###.#.#.#.#.#.###..#...#.#.#.##.#.#.#.###.#.##.#.#.###.#..####...#..
 *  47  ....#.#..#.#.#.####..#..#.#.###.##.###.###.##.#.#.#.#...#.##..##.###.#.#.##...#...#
 *  48  ....#...#..###.###.#####.#.#.######.#.#.##.....#.#.#.######.##..#...#.#.#..#.##....
 *  49  ......#...#...#..#.######.#.##.#...#.#..#.#.#.#.#...#..##..#####..##.###.#.#.....#.
 *  50  ...#...#.#.####.##..####.#.#.######.##.#.#.#.#.#.#.#...#.#.##...###.#.#.#..#......#
 *  51  ..#..##.#.#.#.#####.##.##..###.#..#.##..#.#.#.#.#.#.#.#.#.#.#.#..###...###..##.#...
 *  52  ......#.#..#..##..##..#.#######..#.#..##.#.#.#.#.#...#.....#.#.#..###.#.##....#.#..
 *  53  ...#......#..#...#.##..#.#.##.#.#.#..#.##.#.#.#.#.#.#.#.#.#..##.#.####.#..#.#......
 *  54  .....#...#..#.##..#.###.#.#..#.#.####.#..#.#...#.#.#.#.#.#..#..#.#..##.###.#...#...
 *  55  .......##..#.#.###.###.#.#.#..###..#.####.#..#..#...#.#.#.#..##.#.#####.#.#.......#
 *  56  ...##.....#.#.#.#.#.#...#.#.#..####.#.##....#..#.#.#.#.#.#..#..#.#...#.#.#..##.....
 *  57  ....#.##...#.#.#.#.#.#.#.#.#.#.##..#..#.#.#..##.#.#...#.#.#.#.#.#.#####.#.#.#..##..
 *  58  .........#..#.#...#.#.#.#.#.#.#..##..#.#.#.##..#.#.#.#.#.#.......##.##.#.#.#...#...
 *  59  .....#.#..#.#.#..#.#...#.#.#.##.#...#.#.#.#..#..#.#.#.#.#.#..##...#...##..#..#...#.
 *  60  ...#....#..#.#.#...##.#.#.#.#..#..##...#.#.###.#.#.#.#.#.#......#.###.#.#......##..
 *  61  .....##...#.#.#.#.#......#.#.#..#....#..#.#..####.#.#.#....##.#.##..##.#.#.#.#....#
 *  62  ......#....#..##.#..###...#.#....#.#.#.#.#.#.###...#.#.##.#....#.###..#.#.#.#......
 *  63  ....#...#.#.....#.#...#.#..#..#.#.#.#...#.#..#..#.#.#.#..#.#.##..#.#.#.#.#.#...#..#
 *  64  .....#..#..#.#.#.#..#..#.#.#.#.#.#.#.#.#.#.##.##.#.#.#..#...#...#.#.#.#..#..#..##..
 *  65  ...#......#.#.#.#..#.##.#.#.#.#.#.#.#.#....#.#.##.#.#.#..#.#.#.#.#.###.##.##.......
 *  66  ......#....#.#.#...#.#.#.#.....#...#.##.#.#...##.#.#..#.#.#.#.#.#.#.#.#..#..#.#..#.
 *  67  ....#..###..#.#.#.#.#.#.#..#.##.#.#.#..#.#.#.#..#.#.#.#..#.#...#..#.##.##.##.#.....
 *  68  .....#...#.#...#.#.#.#.#.##.#..#...#..#.##..#..###.#.#.#..#..#.#.#.#..#..#.........
 *  69  .....#..#.#..#..#.#.#...#....#..#.#.##.#..#.#.#..#.##.#....#..#.#...#..#.#..#.##..#
 *  70  ..............#..#.......#.....#.#.#..#...........#.....#.#.##.#.##...#.#.##..#....
 *  71  .......#....#......#.##.#..#.........#...##..#..#....#.#...#..............#.....#..
 *  72  ....##...###.#..#...........###.#.#.#...........#..#.......#..#..##.#..#.....##....
 *  73  ......#...#.......###..#.#.......#....###.#.#.##...#..#..#.....#....#.#..#.........
 *  74  .....#......#.#..........#..#.#....#.#............#......##..#..#..........##..#...
 *  75  .......#.....#..##.#.#..#..............###...#.#.....#....#....#.......#.#.#.#.....
 *  76  .........#.#....#.....#....#..#..#.#.......#......#...#...........#................
 *  77  .........................................................#..#......................
 * 
 * Round 973
 * grid_row_min -13
 * grid_col_min -14
 * grid_row_max 123
 * grid_col_max 126
 * 
 * Result Part 1 = 4181
 * Result Part 2 = 973
 * 
 */
