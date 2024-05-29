import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "child_process";

describe("Transactions routes", () => {
  beforeAll(async () => {
    
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it("should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);
  });

  it("sould be able to linst all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)

    expect(listTransactionResponse.body.transactions).toEqual([
        expect.objectContaining({
            title: "New Transaction",
            amount: 5000,
        }),
    ])
  });

  it("sould be able to get a specifiv transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .set('Cookie', cookies)
      .send({
        title: "New Transaction",
        amount: 5000,
        type: "credit",
      });

    const listTransactionResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)


    
    expect(listTransactionResponse.body.transactions).toEqual([
        expect.objectContaining({
            title: "New Transaction",
            amount: 5000,
        }),
    ])
  });
});
