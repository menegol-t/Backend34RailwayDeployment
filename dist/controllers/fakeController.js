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
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
faker_1.faker.locale = "en";
const randomProd = () => __awaiter(void 0, void 0, void 0, function* () {
    const fakeData = [];
    for (let i = 0; i < 5; i++) {
        fakeData.push({
            id: i + 1,
            title: faker_1.faker.commerce.product(),
            price: faker_1.faker.finance.amount(1000, 5000, 2, "$"),
            thumbnail: faker_1.faker.image.imageUrl(70, 70, 'cat', true),
        });
    }
    return yield fakeData;
});
exports.default = randomProd;
