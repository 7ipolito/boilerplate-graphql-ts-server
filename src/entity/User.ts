import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column("varchar", { length: 25 })
  email: string | undefined;

  @Column("text")
  password: string | undefined;

  @Column("boolean", { default: false })
  confirmed: boolean | undefined;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    } else {
      throw new Error("Password is not defined");
    }
  }
}