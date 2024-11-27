declare namespace NodeJS {
    interface Global {
      DB: D1Database;
    }
  }
  
  declare const global: NodeJS.Global;