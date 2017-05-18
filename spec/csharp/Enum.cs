enum MyEnum
{
    FirstValue,
    [SomeStuff]
    [SomeAttribute("qwdqkwd, lol hehe")]
    SecondValue = -4,
    [SomeAttribute(DisplayName = "foobar, lol")]
    ThirdValue,
    [SomeAttribute, FooAttribute("lol"), BlahAttribute(DisplayName = "qwdkqwd, test")]
    FourthValue = 6,
    FifthValue
}

class Foo
{
    enum StuffEnum
    {
        Lol,
        Bar
    }

    enum OtherEnumStuff
    {
        Hello,
        World
    }
}