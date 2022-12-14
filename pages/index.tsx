import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'
import terminalStyles from '../styles/terminal.module.css'
import { BashInterPriter } from '../src/interpriter/interpriter'
import React from 'react'
// import {browserName,osName} from 'react-device-detect'
const Home: NextPage = () => {


  const inputForm = useRef<null | HTMLInputElement>(null);
  useEffect(() => {
    inputForm.current?.focus();
  }, [inputForm]);

  const [logs, setLogs] = useState<any[]>([]);

  const [command, setCommand] = useState<string>('');

  const [commandHistories, setCommandHostories] = useState<string[]>([]);
  const [currentLogNumber, setCurrentLogNumber] = useState<number>(0);

  const promptRef = useRef<null | HTMLDivElement>(null);

  const [currentHistory, setCurrentHistory] = useState<any[]>([]);
  const terminalRef=useRef<null | HTMLDivElement>(null);
  
  const [loading,setLoading]=useState<boolean>(true);
  // const [loadingText,setLoadingText]=useState<string>('');
  
  useEffect(()=>{
    let done=false;

    if(!done){
      stdout('Welcome to my portfolio');
      stdout('Wait Loading...')
      let id=setTimeout(()=>{
        setLoading(false);
        stdout('Done!✨✨');
        stdout('⚠Your Network looks Slow⏳')
        stdout('Fonts are loaded in the Background.');
        stdout(`Type 'help' to see commands`)
        
        
      },2000);
      document.fonts.onloadingdone=()=>{
        if(loading){
          
          clearInterval(id);
          setLoading(false);

          stdout('Done!✨✨');
          stdout('Fonts are loaded in the Background.');
          stdout(`Type 'help' to see commands`)
  
        }
      };
    }
    return ()=>{
      done=true;
    }
    
  },[])
  
  const ForcusInput=()=>{
    inputForm?.current?.scrollIntoView({behavior:'smooth'});
    inputForm?.current?.focus();  
        
  }

  useEffect(() => {
    console.log('currentHistory', currentHistory);
    setLogs( [
      ...logs,
      ...currentHistory
    ]);
    ForcusInput();
    currentHistory.splice(0);
    console.log(logs);
  }, [currentHistory]);


  useEffect(() => {
    // console.log('scroll'+terminalRef.current?.scrollHeight);
    // terminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(()=>{
    inputForm?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    inputForm?.current?.focus();
  },[inputForm])

  const stdout = (msg: string) => {
    console.log('stdout_log->', msg);

    const m = msg.split('\n').map((line) => {
      return <p>{line}</p>
    });
    // console.log(m);
    setCurrentHistory(
      (beforeValues) => [...beforeValues, ...m]
    );
  }


  const stderr = (msg: string) => {
    console.log('std_err->'+msg);
    setCurrentHistory(
      (beforeValues) => [...beforeValues, <p className="text-red-500">{msg}</p>]
    );
  }

  const stdin = () => {
    return '';
  };

  const bashInterPriter = BashInterPriter.getInstance(stdin, stdout, stderr);

  const Exefunc = (command: string) => {
    if (command === '') {
      return;
    }
    bashInterPriter.run(command);
  }


  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const promptStr = promptRef.current?.innerHTML || '';

      setLogs((beforeValues) => { return [...beforeValues, promptStr + command] });

      setCommandHostories([command, ...commandHistories]);
      
      ForcusInput();
      
      Exefunc(command);
      
      setCommand('');
      setCurrentLogNumber(0);
    }
    else if (e.key == 'ArrowUp') {
      setCommand(commandHistories[(currentLogNumber) % commandHistories.length]);
      setCurrentLogNumber(currentLogNumber + 1);
    }
    else if (e.key == 'ArrowDown') {
      setCommand(commandHistories[(currentLogNumber - 2) % commandHistories.length]);
      setCurrentLogNumber(currentLogNumber - 1);
    }else if(e.key=='Tab'){
      e.preventDefault();
      setCommand((prev)=>prev+' ls');
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Terminal Portfolio</title>
        <meta name="description" content="codegen-7x's portfolio" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'></link>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet"/>

      </Head>
      <style jsx>{`
      ::selection {
        color: #fff;
        background: grey;
      }
      .output::-webkit-scrollbar{
        width:5px;
        
        
      }
      // @font-face {
        // font-family: 'hackgen';
        // src: url('/font/HackGen35ConsoleNF-Regular.ttf') format('truetype');
        
      // }
      .output{
        // font-family: 'hackgen', monospace;
        font-family: hackgen SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji
      }
      ::-webkit-scrollbar-thumb {
        background: grey;
        
        border-radius: 5px;
      }
      @media screen and (max-width: 768px) {
        .window{
          width:95vw;
          height:90%;    
        }
      }
      .window{
        min-width: 80vw;
        // height:100%;
      }
    `}</style>
      <div className='bg-black'>
        <div className="bg-gradient-to-t flex items-center  from-purple-900 to-pink-700 h-[100vh] w-[100vw]">
          <div style={{margin:'0 auto',overflowWrap:'break-word'}} className="window rounded-lg bg-scroll bg-black inset-5 w-[60vw] h-[90%]" role="window">
            <div role="title bar" className="flex items-center h-6 gap-2 px-3 text-2xl font-light text-white align-middle bg-gray-300 rounded-tl-lg rounded-tr-lg">
             
                <div onClick={()=>{document.location.href='//idichi.tk'}} className='w-4 h-4 bg-red-500 rounded-full hover:ring-4'></div>
                <div className='w-4 h-4 bg-yellow-500 rounded-full hover:ring-4'></div>
                <div className='w-4 h-4 bg-green-500 rounded-full hover:ring-4'></div>
             
            </div>
            <div ref={terminalRef} role="terminal" className="flex flex-col h-full px-2 overflow-scroll text-white bg-scroll bg-black rounded-b-lg output" >


              
              {logs.map((value, index) => {
                return typeof(value)==='string'? <div dangerouslySetInnerHTML={{__html:value}}></div>: <div key={index} className={terminalStyles.log}>{value}</div>
              })}

              { !loading &&
              
              <div className="">
                <p ref={promptRef} className='inline'><span className='text-blue-500'>{bashInterPriter.getCurentUser()}</span>@<span className='text-blue-600'></span>:<span className='text-green-500'>{bashInterPriter.getCwd()}</span>{"$"} </p>
                <input ref={inputForm} value={command} onChange={onInputChange} onKeyDown={onInputKeyDown} type={'text'} className="inline px-0 text-white bg-black border-none w focus:outline-none" />
                {/* <b className='left-0' style={{left:0}}>i</b> */}
                {/* <div className='w-1 px-1 animate-ping'></div> */}
              </div>
            }
            </div>
          </div>

        </div>
      </div>


    </div>
  )
}

export default Home
