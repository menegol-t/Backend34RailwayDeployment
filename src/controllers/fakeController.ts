import { faker } from "@faker-js/faker"

faker.locale = "en"

const randomProd = async () => {
    const fakeData: any = []
    for(let i = 0 ; i < 5 ; i++){
        fakeData.push({
            id: i + 1,
            title: faker.commerce.product(),
            price: faker.finance.amount(1000, 5000, 2, "$"),
            thumbnail: faker.image.imageUrl(70, 70, 'cat', true),
        })
    }
    return await fakeData
}

export default randomProd