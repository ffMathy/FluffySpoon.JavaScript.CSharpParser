[SomeAttribute]
enum MyEnum: int
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

namespace Blah {
    public enum BlahEnum
    {
        Hello,
        World
    }
}

class Foo
{
    enum StuffEnum : System.Int32
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