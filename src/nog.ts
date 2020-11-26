class Nog{
  private config:{
    color:string
  };
  constructor(config={
    color:'#333'
  }){
    this.config=config;
  }
  color(color:string){
    return new Nog({
      ...this.config,
      color
    });
  }
}

export default new Nog({});