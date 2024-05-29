"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = require("../src/app");
const supertest_1 = __importDefault(require("supertest"));
const child_process_1 = require("child_process");
(0, vitest_1.describe)("Transactions routes", () => {
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app_1.app.ready();
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app_1.app.close();
    }));
    (0, vitest_1.beforeEach)(() => {
        (0, child_process_1.execSync)('npm run knex migrate:rollback --all');
        (0, child_process_1.execSync)('npm run knex migrate:latest');
    });
    (0, vitest_1.it)("should be able to create a new transaction", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app.server)
            .post("/transactions")
            .send({
            title: "New Transaction",
            amount: 5000,
            type: "credit",
        })
            .expect(201);
    }));
    (0, vitest_1.it)("sould be able to linst all transactions", () => __awaiter(void 0, void 0, void 0, function* () {
        const createTransactionResponse = yield (0, supertest_1.default)(app_1.app.server)
            .post("/transactions")
            .send({
            title: "New Transaction",
            amount: 5000,
            type: "credit",
        });
        const cookies = createTransactionResponse.get("Set-Cookie");
        const listTransactionResponse = yield (0, supertest_1.default)(app_1.app.server)
            .get("/transactions")
            .set("Cookie", cookies);
        (0, vitest_1.expect)(listTransactionResponse.body.transactions).toEqual([
            vitest_1.expect.objectContaining({
                title: "New Transaction",
                amount: 5000,
            }),
        ]);
    }));
});
