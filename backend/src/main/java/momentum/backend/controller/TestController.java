package momentum.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

class Human {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

@RestController
@RequestMapping
public class TestController {
    @GetMapping("/")
    Human hello() {
        Human raj = new Human();
        raj.setName("raj");
        raj.setAge(20);
        return raj;
    }
}
