import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, BeforeInsert, BaseEntity } from "typeorm"
import { v4 } from 'uuid';
@Entity("users")
export class User extends BaseEntity{

    @PrimaryColumn("uuid") id: string | undefined;

    @Column("varchar",{length: 25}) email:string | undefined;

    @Column("text") password: string | undefined

    @BeforeInsert()
    addId(){
        this.id = v4();
    }

}


User.create
