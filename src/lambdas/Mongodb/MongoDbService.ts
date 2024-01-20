import { Db, MongoClient } from 'mongodb';
import { Equine } from './models/models';

export interface DBConfig {
  dbName: string;
  user: string;
  pass: string;
}
enum collections {
  equines = 'equines',
}
const table = 'equines';

export class MongoDBService {
  private uri: string | undefined;
  private dbName: string | undefined;
  private client: MongoClient | undefined;
  private database: Db | undefined;

  constructor(config: DBConfig) {
    this.uri = `mongodb+srv://${config.user}:${config.pass}@cluster0.uwhi5uh.mongodb.net/?retryWrites=true&w=majority`;
    this.dbName = config.dbName;
  }

  public async open(): Promise<boolean> {
    try {
      if (!this.uri) {
        console.error('Error:uri', this.uri);
        return false;
      }
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      this.database = await this.client.db(this.dbName);
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
    return true;
  }

  public async insert(data: Equine): Promise<boolean> {
    try {
      if (!this.database) {
        console.error('Error:database', this.database);
        return false;
      }
      const collection = await this.database.collection(collections.equines);
      const result = await collection.insertOne(data);
      console.info('inserted', result.insertedId);
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
    return true;
  }

  public async close(): Promise<boolean> {
    if (this.client) {
      console.info('closing mongo connection');
      try {
        await this.client.close();
      } catch (err: any) {
        console.error(err.message);
        return false;
      }
    }
    return true;
  }
}
