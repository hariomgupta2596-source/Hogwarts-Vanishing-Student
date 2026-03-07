import React,{ useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { GameLayout } from "@/components/GameLayout";
import { useUpdateProgress } from "@/hooks/use-game";
import { useGameStore } from "@/lib/store";

/* ---------------- HOGWARTS STYLE ---------------- */

const boardStyle = {
 borderRadius: "10px",
 boxShadow: "0 0 25px rgba(255,215,0,0.5)"
};

const darkSquare = { backgroundColor: "#3b2f14" };
const lightSquare = { backgroundColor: "#e5c76b" };

/* ---------------- CHESS PUZZLES ---------------- */

const PUZZLES = [

{
 id:1,
 fen:"k1b5/p7/1P6/8/8/8/6K1/R7 w - - 0 1",
 title:"Attendance Register Security"
},

{
 id:2,
 fen:"8/8/2Q5/3B4/1K6/2P5/1k6/8 w - - 0 1",
 title:"Magical Trace Archive Security"
},

{
 id:3,
 fen:"r4r2/pQ3ppp/2np4/2bk4/5P2/6P1/PPP5/R1B1KB1q w - - 0 1",
 // fen:"r4r2/pQ3ppp/2np4/2bk4/5P2/6P1/PPP3K1/R1B2B1q w - - 0 1",
 title:"Identity Registry Security"
}

];

/* ---------------- CLUES ---------------- */

const CLUES = {

attendance:[
 {name:"Cedric D.",value:"Present"},
 {name:"Unknown",value:"Present"},
 {name:"Draco M.",value:"Absent"},
 {name:"Luna L.",value:"Present"}
],

traces:[
 {name:"Cedric D.",value:"None"},
 {name:"Unknown",value:"High"},
 {name:"Draco M.",value:"High"},
 {name:"Luna L.",value:"Low"}
],

identity:[
 {name:"Cedric D.",value:"Verified"},
 {name:"Unknown",value:"Missing"},
 {name:"Draco M.",value:"Verified"},
 {name:"Luna L.",value:"Verified"}
]

};


/* ---------------- CHESS PUZZLE COMPONENT ---------------- */

function WizardChess({fen,onSolved}){

 const [game,setGame] = useState(new Chess(fen));
 const [error,setError] = useState(false);

 function makeMove(move){

  const gameCopy = new Chess(game.fen());

  const result = gameCopy.move(move);

  if(result===null){
   setError(true);
   setTimeout(()=>setError(false),1000);
   return false;
  }

  setGame(gameCopy);

  if(gameCopy.isCheckmate()){
   setTimeout(()=>onSolved(),700);
  }

  return true;
 }

 function onDrop(source,target){

  return makeMove({
   from:source,
   to:target,
   promotion:"q"
  });

 }

 return(

 <div className="flex flex-col items-center">

 <Chessboard
  position={game.fen()}
  onPieceDrop={onDrop}
  boardWidth={420}
  customBoardStyle={boardStyle}
  customDarkSquareStyle={darkSquare}
  customLightSquareStyle={lightSquare}
/>

{error &&(
 <p className="text-red-500 mt-3">
 Illegal move
 </p>
)}

 </div>

 )

}


/* ---------------- EVIDENCE PANEL ---------------- */

function Evidence({title,data}){

 return(

 <motion.div
  initial={{opacity:0,y:20}}
  animate={{opacity:1,y:0}}
  className="glass-panel p-6 rounded-xl border border-yellow-400/20"
 >

 <h3 className="text-yellow-400 text-lg mb-4">
 {title}
 </h3>

 <div className="space-y-2">

 {data.map((row)=>(
 <div
  key={row.name}
  className="flex justify-between text-lg"
 >
 <span className={row.name==="Unknown"?"blur-sm hover:blur-none transition":""}>
 {row.name}
 </span>

 <span>{row.value}</span>

 </div>
 ))}

 </div>

 </motion.div>

 )

}


/* ---------------- MAIN GAME ---------------- */

export function Game4(){

 const [step,setStep] = useState(0);
 const [answer,setAnswer] = useState("");
 const [error,setError] = useState(false);

 const { mutate:updateProgress } = useUpdateProgress();
 const [,setLocation] = useLocation();
 const user = useGameStore(state=>state.user);


 function solvePuzzle(){
  setStep(step+1);
 }


 function submitAnswer(){

  if(answer.toLowerCase().includes("unknown")){

   if(user && user.completedGames<4){

    updateProgress(
     {scoreAdded:200,gameCompleted:4},
     {onSuccess:()=>setLocation("/hub")}
    );

   }else{
    setLocation("/hub");
   }

  }else{

   setError(true);

   setTimeout(()=>setError(false),1500);

  }

 }


 return(

<GameLayout title="The Ministry Investigation">

<div className="max-w-4xl mx-auto mt-8 space-y-10">

<motion.h2
 initial={{opacity:0}}
 animate={{opacity:1}}
 className="text-center text-2xl text-yellow-400 tracking-widest"
>
Wizard Security Investigation
</motion.h2>


{/* PUZZLE SECTION */}

{step < 3 &&(

<div className="text-center">

<h3 className="text-lg text-yellow-400 mb-4">
{PUZZLES[step].title}
</h3>

<WizardChess
 fen={PUZZLES[step].fen}
 onSolved={solvePuzzle}
/>

<p className="mt-4 text-gray-400">
Break the wizard chess security to access ministry records.
</p>

</div>

)}


{/* CLUE 1 */}

{step>=1 &&(
<Evidence
 title="Attendance Records"
 data={CLUES.attendance}
/>
)}


{/* CLUE 2 */}

{step>=2 &&(
<Evidence
 title="Magical Traces"
 data={CLUES.traces}
/>
)}


{/* CLUE 3 */}

{step>=3 &&(
<Evidence
 title="Identity Status"
 data={CLUES.identity}
/>
)}


/* FINAL ANSWER */

{step>=3 &&(

<motion.div
 initial={{opacity:0}}
 animate={{opacity:1}}
 className="glass-panel p-6 text-center rounded-xl"
>

<h3 className="text-yellow-400 text-xl mb-3">
Identify the Missing Student
</h3>

<input
 value={answer}
 onChange={(e)=>setAnswer(e.target.value)}
 placeholder="Type the missing student name..."
 className="px-4 py-2 border rounded-md"
/>

<button
 onClick={submitAnswer}
 className="ml-3 px-5 py-2 bg-yellow-400 text-black rounded"
>
Submit
</button>

{error &&(
<p className="text-red-500 mt-3">
Incorrect deduction.
</p>
)}

</motion.div>

)}

</div>

</GameLayout>

 );

}