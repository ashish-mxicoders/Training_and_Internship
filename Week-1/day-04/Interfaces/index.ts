interface Person{
    name: string;
    age: number;
    height?: number;
}

interface Employee extends Person{
    employeeId: number;
}

const person: Person = {
    name: "Jane Doe",
    age: 25,
    height: 5.6
};

const employee: Employee = {
    name: "John Doe",
    age: 30,
    employeeId: 12345
};