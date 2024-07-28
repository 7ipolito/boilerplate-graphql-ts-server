import { Entity, PrimaryGeneratedColumn, Column,BaseEntity } from "typeorm"
@Entity("users")
export class User extends BaseEntity{

    @PrimaryGeneratedColumn("uuid")
    id: string | undefined;

    @Column("varchar",{length: 25})
    email:string | undefined;

    @Column("text")
    password: string | undefined

    @Column("boolean", {default:false})
    confirmed: boolean | undefined;



}


User.create