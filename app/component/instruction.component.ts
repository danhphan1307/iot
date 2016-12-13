import { Component } from '@angular/core';
import { CarouselModule } from 'ng2-bootstrap/ng2-bootstrap';
function localStorage_hasData() {
  try {
    return (localStorage.getItem("showInstruction") =='true');
  }
  catch (e) {
    return false;
  }
};
@Component({
  selector: 'carouselInstruction',
  templateUrl: 'instruction.component.html',
})
export class CarouselComponent {
  public myInterval:number = 0;
  private pictureNumber:number = 6;
  public noWrapSlides:boolean = true;
  public slides:Array<any> = [];
  state:boolean=false;

  public constructor() {
    for (let i = 0; i < this.pictureNumber; i++) {
      this.addSlide();
    }
    if(localStorage_hasData()){
      this.state=true;
    }
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown:any = null;                                                        
    var yDown:any = null;                                                        

    function handleTouchStart(evt:any) {                                         
      xDown = evt.touches[0].clientX;                                      
      yDown = evt.touches[0].clientY;                                      
    };                                                

    function handleTouchMove(evt:any) {
      if ( ! xDown || ! yDown ) {
        return;
      }

      var xUp = evt.touches[0].clientX;                                    
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant, this time we just care about x movement*/
        (<HTMLElement>document.getElementsByClassName('item text-center active')[0].childNodes[2]).className ='img-responsive';
        if ( xDiff > 5) {
          /* left swipe */ 
          Promise.resolve((<HTMLElement>document.getElementsByClassName('glyphicon glyphicon-chevron-right')[0]).click()).then(()=>{
            (<HTMLElement>document.getElementsByClassName('item text-center active')[0].childNodes[2]).className += " leftAni";
          });
          ;
        } else if ( xDiff < -5)  {
          /* right swipe */
          Promise.resolve((<HTMLElement>document.getElementsByClassName('glyphicon glyphicon-chevron-left')[0]).click()).then(()=>{
            (<HTMLElement>document.getElementsByClassName('item text-center active')[0].childNodes[2]).className += " rightAni";
          });
        }        
      }
      /* reset values */
      xDown = null;
      yDown = null;                                             
    };
  }


  public closeInstruction(){
    this.state = false;
    localStorage.setItem('showInstruction',(!(<HTMLInputElement>document.getElementById('showInstructionCheckbox')).checked).toString());
  }

  public showInstruction(){
    this.state = true;
  }

  public addSlide():void {
    let newWidth = this.slides.length + 1;
    this.slides.push({
      image: `../img/${newWidth}.png`,
      title:`${['Smart Bike', 'Analysis', 'Pair Device', 'Secure','City Bike',  'Let\'s Go Biking'][this.slides.length % this.pictureNumber]}`,
      text: `${['You can instantly see distance and burned calories', 'Gathering your information and display through charts', 'Easy to pair new device with Mac Address', 'We DO NOT directly store your information to our database. Your password is hashed also', 'Using City Bikes. Why not?',''][this.slides.length % this.pictureNumber]}`
    });
  }
}